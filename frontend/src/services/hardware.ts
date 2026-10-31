import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { LocalNotifications } from '@capacitor/local-notifications';
import { KeepAwake } from '@capacitor-community/keep-awake';
import { Capacitor } from '@capacitor/core';

let webWakeLock: any = null;
let webTimerTimeout: any = null;

export const hardware = {
  /**
   * Тактильная отдача (виброотклик) при нажатиях, переключении подходов и завершении
   */
  haptic: async (type: 'light' | 'medium' | 'heavy' | 'success' | 'warning' = 'medium') => {
    try {
      if (!Capacitor.isPluginAvailable('Haptics')) return;
      if (type === 'light') {
        await Haptics.impact({ style: ImpactStyle.Light });
      } else if (type === 'medium') {
        await Haptics.impact({ style: ImpactStyle.Medium });
      } else if (type === 'heavy') {
        await Haptics.impact({ style: ImpactStyle.Heavy });
      } else if (type === 'success') {
        await Haptics.notification({ type: NotificationType.Success });
      } else if (type === 'warning') {
        await Haptics.notification({ type: NotificationType.Warning });
      }
    } catch (e) {
      // Игнорируем в веб-браузере
    }
  },

  /**
   * Звуковой сигнал завершения таймера отдыха (Web Audio API)
   */
  playTimerBeep: () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const playTone = (freq: number, start: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
        gain.gain.setValueAtTime(0.35, ctx.currentTime + start);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + start);
        osc.stop(ctx.currentTime + start + duration);
      };
      // 3 коротких сигнала + 1 финальный длинный
      playTone(880, 0, 0.12);
      playTone(880, 0.22, 0.12);
      playTone(880, 0.44, 0.12);
      playTone(1320, 0.66, 0.45);
    } catch (e) {
      console.warn('Audio beep error:', e);
    }
  },

  /**
   * Запрос разрешений на отправку локальных пуш-уведомлений (Capacitor & Web)
   */
  requestNotificationPermission: async (): Promise<boolean> => {
    try {
      if (Capacitor.isPluginAvailable('LocalNotifications')) {
        const status = await LocalNotifications.checkPermissions();
        if (status.display !== 'granted') {
          const req = await LocalNotifications.requestPermissions();
          return req.display === 'granted';
        }
        return true;
      } else if (typeof window !== 'undefined' && 'Notification' in window) {
        if (Notification.permission === 'granted') return true;
        if (Notification.permission !== 'denied') {
          const res = await Notification.requestPermission();
          return res === 'granted';
        }
      }
      return false;
    } catch {
      return false;
    }
  },

  /**
   * Мощная вибросигнализация завершения таймера отдыха (серия длинных импульсов вибромотора)
   */
  strongTimerVibrate: async () => {
    try {
      // Воспроизводим звуковой зуммер
      hardware.playTimerBeep();

      // 1. Web Vibration API pattern if supported
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate([800, 200, 800, 200, 1000]);
      }

      // 2. Capacitor Haptics motor vibration (duration in ms)
      if (Capacitor.isPluginAvailable('Haptics')) {
        await Haptics.vibrate({ duration: 800 });
        setTimeout(async () => {
          try {
            await Haptics.vibrate({ duration: 800 });
          } catch {}
        }, 1000);
        setTimeout(async () => {
          try {
            await Haptics.vibrate({ duration: 1000 });
          } catch {}
        }, 2000);
      }
    } catch (e) {
      console.warn('Vibration error:', e);
    }
  },

  /**
   * Запуск таймера отдыха между подходами (фоновый пуш + вибрация)
   * @param fromRestBar - флаг, предотвращающий зацикливание при вызове из RestTimerBar
   */
  scheduleRestTimer: (seconds: number, exerciseName?: string, fromRestBar = false): number => {
    const notificationId = 1001;

    // Глобальное событие для синхронизации плавающей панели RestTimerBar (только если вызов снаружи, например из дневника)
    if (!fromRestBar && typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('mslift:start-rest-timer', {
          detail: { seconds, exerciseName }
        })
      );
    }

    // Фоновое асинхронное планирование системных пушей (не блокирует таймер в UI)
    (async () => {
      try {
        if (Capacitor.isPluginAvailable('LocalNotifications')) {
          await hardware.requestNotificationPermission();

          // Configure Android notification channel with high priority vibration
          try {
            await LocalNotifications.createChannel({
              id: 'rest-timer-channel',
              name: 'Таймер отдыха MSLift',
              description: 'Оповещения об окончании времени отдыха между подходами',
              importance: 5,
              visibility: 1,
              vibration: true,
              lights: true
            });
          } catch {
            // Channel already exists or not supported
          }

          // Отменяем предыдущие таймеры
          await LocalNotifications.cancel({ notifications: [{ id: notificationId }] });

          const scheduleDate = new Date(Date.now() + seconds * 1000);

          await LocalNotifications.schedule({
            notifications: [
              {
                id: notificationId,
                title: '⏰ MSLift: Время отдыха истекло!',
                body: exerciseName ? `${exerciseName}: пора на следующий подход!` : 'Пора на помост! Удачного подхода!',
                channelId: 'rest-timer-channel',
                schedule: { at: scheduleDate, allowWhileIdle: true },
                sound: undefined,
                actionTypeId: '',
                extra: null
              }
            ]
          });
        } else if (typeof window !== 'undefined' && 'Notification' in window) {
          // Fallback для веб-браузеров / мобильного Chrome
          if (webTimerTimeout) clearTimeout(webTimerTimeout);
          webTimerTimeout = setTimeout(() => {
            try {
              if (Notification.permission === 'granted') {
                new Notification('⏰ MSLift: Время отдыха истекло!', {
                  body: exerciseName ? `${exerciseName}: пора на следующий подход!` : 'Пора на помост! Удачного подхода!',
                  icon: '/favicon.ico',
                  tag: 'mslift-rest-timer'
                });
              }
              hardware.strongTimerVibrate();
            } catch {}
          }, seconds * 1000);
        }
      } catch (e) {
        console.warn('Не удалось запланировать уведомление таймера:', e);
      }
    })();

    return notificationId;
  },

  /**
   * Отмена активного таймера отдыха
   */
  cancelRestTimer: async () => {
    try {
      if (webTimerTimeout) {
        clearTimeout(webTimerTimeout);
        webTimerTimeout = null;
      }
      if (Capacitor.isPluginAvailable('LocalNotifications')) {
        await LocalNotifications.cancel({ notifications: [{ id: 1001 }] });
      }
    } catch (e) {
      console.warn('Ошибка отмены таймера:', e);
    }
  },

  /**
   * Удержание экрана включенным во время тренировки (Wake Lock)
   */
  setKeepAwake: async (enable: boolean) => {
    try {
      if (enable) {
        if (Capacitor.isPluginAvailable('KeepAwake')) {
          await KeepAwake.keepAwake();
        } else if (typeof navigator !== 'undefined' && 'wakeLock' in navigator) {
          try {
            webWakeLock = await (navigator as any).wakeLock.request('screen');
          } catch {}
        }
      } else {
        if (Capacitor.isPluginAvailable('KeepAwake')) {
          await KeepAwake.allowSleep();
        }
        if (webWakeLock) {
          try {
            await webWakeLock.release();
          } catch {}
          webWakeLock = null;
        }
      }
    } catch (e) {
      // Игнорируем ошибки при отсутствии поддержки
    }
  }
};
