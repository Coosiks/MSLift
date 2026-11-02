import fs from 'fs';
import path from 'path';

const migrationsDir = 'c:/Projects/MSLift/src/main/resources/db/migration';
const sqlFiles = [
  'V4__add_programs.sql',
  'V5__add_all_bench_programs.sql',
  'V6__add_squat_and_deadlift_programs.sql',
  'V7__add_powerlifting_programs.sql',
  'V8__fix_universal_programs.sql'
];

const programsMap = new Map();

function norm(str) {
  return str.trim().replace(/^['"]|['"]$/g, '').trim();
}

for (const file of sqlFiles) {
  const filePath = path.join(migrationsDir, file);
  if (!fs.existsSync(filePath)) continue;
  const content = fs.readFileSync(filePath, 'utf-8');

  // 1. Extract INSERT INTO training_program
  const programRegex = /INSERT\s+INTO\s+training_program\s*\([^)]*\)\s*VALUES\s*\(\s*'([^']+)'\s*,\s*'([^']+)'\s*,\s*(\d+)(?:\s*,\s*'([^']+)')?\s*\)/gi;
  let match;
  while ((match = programRegex.exec(content)) !== null) {
    const name = norm(match[1]);
    const description = norm(match[2]);
    const durationWeeks = parseInt(match[3], 10);
    let movementCategory = match[4] ? norm(match[4]) : 'BENCH';
    if (!movementCategory || movementCategory === 'NULL') movementCategory = 'BENCH';

    const id = name.toLowerCase().replace(/[^a-z0-9а-яё]+/gi, '-').replace(/^-|-$/g, '');
    programsMap.set(name, {
      id,
      name,
      description,
      durationWeeks,
      movementCategory,
      templates: []
    });
  }

  // Handle overrides in V8
  if (file === 'V8__fix_universal_programs.sql') {
    programsMap.delete('Метод Куба (The Cube Method)');
    programsMap.delete('6-недельный цикл Кэндито (Candito)');
    programsMap.delete('5/3/1 Джима Вендлера (Присед и Тяга)');

    const cube = programsMap.get('Метод Куба (The Cube Method — Троеборье)');
    if (cube) {
      programsMap.delete('Метод Куба (The Cube Method — Троеборье)');
      cube.name = 'Метод Куба (The Cube Method)';
      programsMap.set(cube.name, cube);
    }

    const candito = programsMap.get('Candito 6 Week Strength Program (Троеборье)');
    if (candito) {
      programsMap.delete('Candito 6 Week Strength Program (Троеборье)');
      candito.name = 'Candito 6 Week Strength Program (6 недель Кэндито)';
      programsMap.set(candito.name, candito);
    }
  }

  // 2. Parse sections
  const progSectionRegex = /SELECT\s+id\s+INTO\s+(?:prog_id|p_id|program_id|stepanov_id)\s+FROM\s+training_program\s+WHERE\s+name\s*=\s*'([^']+)'\s*;([\s\S]*?)(?:END\s+IF\s*;)/gi;
  let pMatch;
  while ((pMatch = progSectionRegex.exec(content)) !== null) {
    const progName = norm(pMatch[1]);
    const sectionBody = pMatch[2];

    let prog = programsMap.get(progName);
    if (!prog) {
      for (const [k, v] of programsMap.entries()) {
        if (k.includes(progName) || progName.includes(k)) {
          prog = v;
          break;
        }
      }
    }
    if (!prog) continue;

    if (file === 'V8__fix_universal_programs.sql') {
      prog.templates = [];
    }

    // Check if section contains FOR loops
    // e.g. FOR w IN 1..4 LOOP ... [FOR d IN 1..3 LOOP] ... END LOOP;
    const forLoopRegex = /FOR\s+w\s+IN\s+(\d+)\.\.(\d+)\s+LOOP([\s\S]*?)END\s+LOOP\s*;/gi;
    let loopMatch;
    let hasLoops = false;

    while ((loopMatch = forLoopRegex.exec(sectionBody)) !== null) {
      hasLoops = true;
      const wStart = parseInt(loopMatch[1], 10);
      const wEnd = parseInt(loopMatch[2], 10);
      const loopContent = loopMatch[3];

      // Check for nested FOR d IN ...
      const innerLoopMatch = loopContent.match(/FOR\s+d\s+IN\s+(\d+)\.\.(\d+)\s+LOOP([\s\S]*?)END\s+LOOP\s*;/i);
      if (innerLoopMatch) {
        const dStart = parseInt(innerLoopMatch[1], 10);
        const dEnd = parseInt(innerLoopMatch[2], 10);
        const innerContent = innerLoopMatch[3];

        for (let w = wStart; w <= wEnd; w++) {
          for (let d = dStart; d <= dEnd; d++) {
            parseTuples(innerContent, w, d, prog);
          }
        }
      } else {
        for (let w = wStart; w <= wEnd; w++) {
          parseTuples(loopContent, w, null, prog);
        }
      }
    }

    // Also parse static tuples outside loops in this section
    const nonLoopContent = sectionBody.replace(forLoopRegex, '');
    parseTuples(nonLoopContent, null, null, prog);
  }

  // 3. Direct INSERTs in V4
  const directInserts = content.matchAll(/INSERT\s+INTO\s+program_workout_template[^\n]*\s*SELECT\s*\(SELECT\s+id\s+FROM\s+training_program\s+WHERE\s+name\s*=\s*'([^']+)'\)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*\(SELECT\s+id\s+FROM\s+exercise\s+WHERE\s+name\s*=\s*'([^']+)'\)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([\d.]+)\s*,\s*(\d+)/gi);
  for (const di of directInserts) {
    const progName = norm(di[1]);
    const prog = programsMap.get(progName);
    if (!prog) continue;
    const weekNumber = parseInt(di[2], 10);
    const dayNumber = parseInt(di[3], 10);
    const exerciseName = norm(di[4]);
    const sets = parseInt(di[5], 10);
    const reps = parseInt(di[6], 10);
    const intensityPercentage = parseFloat(di[7]);
    const restSeconds = parseInt(di[8], 10);
    const exerciseId = exerciseName.includes('Присед') ? 'ex-squat' : exerciseName.includes('тяг') ? 'ex-deadlift' : 'ex-bench';

    prog.templates.push({
      weekNumber,
      dayNumber,
      exerciseId,
      exerciseName,
      sets,
      reps,
      intensityPercentage,
      restSeconds
    });
  }
}

function parseTuples(str, currentW, currentD, prog) {
  // Regex matches: (prog_id, [w_expr], [d_expr], [ex], [sets], [reps], [intensity_expr], [rest])
  const tupleRegex = /\(\s*(?:prog_id|p_id|program_id|stepanov_id|[a-zA-Z0-9_-]+)\s*,\s*([^,]+)\s*,\s*([^,]+)\s*,\s*([a-zA-Z0-9_]+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([^,]+)\s*,\s*(\d+)\s*\)/gi;
  let tMatch;
  while ((tMatch = tupleRegex.exec(str)) !== null) {
    const rawW = tMatch[1].trim();
    const rawD = tMatch[2].trim();
    const exVar = tMatch[3].trim().toLowerCase();
    const sets = parseInt(tMatch[4], 10);
    const reps = parseInt(tMatch[5], 10);
    const rawIntensity = tMatch[6].trim();
    const restSeconds = parseInt(tMatch[7], 10);

    let weekNumber = currentW !== null ? currentW : parseInt(rawW, 10);
    if (isNaN(weekNumber)) weekNumber = currentW || 1;

    let dayNumber = currentD !== null ? currentD : parseInt(rawD, 10);
    if (isNaN(dayNumber)) dayNumber = currentD || 1;

    let intensityPercentage = 75;
    try {
      // Evaluate expression like "70.0 + (w * 2.0)" or "75.0"
      const evalExpr = rawIntensity.replace(/\bw\b/g, String(weekNumber)).replace(/\bd\b/g, String(dayNumber));
      intensityPercentage = Math.round(Function(`"use strict"; return (${evalExpr})`)() * 10) / 10;
    } catch {
      intensityPercentage = parseFloat(rawIntensity) || 75;
    }

    let exerciseName = 'Жим лежа';
    let exerciseId = 'ex-bench';
    if (exVar.includes('squat')) {
      exerciseName = 'Приседания';
      exerciseId = 'ex-squat';
    } else if (exVar.includes('dead')) {
      exerciseName = 'Становая тяга';
      exerciseId = 'ex-deadlift';
    }

    prog.templates.push({
      weekNumber,
      dayNumber,
      exerciseId,
      exerciseName,
      sets,
      reps,
      intensityPercentage,
      restSeconds
    });
  }
}

// Convert map to array
const allPrograms = Array.from(programsMap.values());
console.log(`\n=== TOTAL PROGRAMS PARSED: ${allPrograms.length} ===\n`);
let totalTemplates = 0;
allPrograms.forEach(p => {
  totalTemplates += p.templates.length;
  console.log(`- ${p.name} (${p.durationWeeks} wks, category: ${p.movementCategory}): ${p.templates.length} sets`);
});
console.log(`\n=== TOTAL TEMPLATES: ${totalTemplates} ===\n`);

const outputPath = 'c:/Projects/mslift-frontend/src/services/programsDb.json';
fs.writeFileSync(outputPath, JSON.stringify(allPrograms, null, 2), 'utf-8');
console.log(`Saved to ${outputPath}`);
