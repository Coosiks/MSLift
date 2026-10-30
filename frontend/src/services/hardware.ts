import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { LocalNotifications } from '@capacitor/local-notifications';
import { KeepAwake } from '@capacitor-community/keep-awake';
import { Capacitor } from '@capacitor/core';

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
   * Запрос разрешений на отправку локальных пуш-уведомлений
   */
  requestNotificationPermission: async (): Promise<boolean> => {
    try {
      if (!Capacitor.isPluginAvailable('LocalNotifications')) return false;
      const status = await LocalNotifications.checkPermissions();
      if (status.display !== 'granted') {
        const req = await LocalNotifications.requestPermissions();
        return req.display === 'granted';
      }
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Мощная вибросигнализация завершения таймера отдыха (серия длинных импульсов вибромотора)
   */
  strongTimerVibrate: async () => {
    try {
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
   */
  scheduleRestTimer: async (seconds: number, exerciseName?: string): Promise<number> => {
    const notificationId = Math.floor(Math.random() * 100000);
    try {
      if (!Capacitor.isPluginAvailable('LocalNotifications')) return notificationId;

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
      await LocalNotifications.cancel({ notifications: [{ id: 1001 }] });

      const scheduleDate = new Date(Date.now() + seconds * 1000);

      await LocalNotifications.schedule({
        notifications: [
          {
            id: 1001,
            title: '⏰ MSLift: Время отдыха истекло!',
            body: exerciseName ? `${exerciseName}: пора на следующий подход!` : 'Пора на помост! Удачного подхода!',
            channelId: 'rest-timer-channel',
            schedule: { at: scheduleDate },
            sound: undefined,
            actionTypeId: '',
            extra: null
          }
        ]
      });

      return 1001;
    } catch (e) {
      console.warn('Не удалось запланировать LocalNotification:', e);
      return notificationId;
    }
  },

  /**
   * Отмена активного таймера отдыха
   */
  cancelRestTimer: async () => {
    try {
      if (!Capacitor.isPluginAvailable('LocalNotifications')) return;
      await LocalNotifications.cancel({ notifications: [{ id: 1001 }] });
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
        } else if ('wakeLock' in navigator) {
          // Native Web Wake Lock API
          // @ts-ignore
          await navigator.wakeLock.request('screen');
        }
      } else {
        if (Capacitor.isPluginAvailable('KeepAwake')) {
          await KeepAwake.allowSleep();
        }
      }
    } catch (e) {
      // Игнорируем ошибки при отсутствии поддержки
    }
  }
};
