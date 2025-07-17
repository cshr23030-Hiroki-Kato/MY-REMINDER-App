// src/services/notificationService.ts

/**
 * 通知発行ロジックをまとめたサービス
 * ブラウザ Notification API を利用してリマインダー通知を行う
 */
export class NotificationService {
  /**
   * 通知権限をリクエスト
   * 初回起動時に呼び出しておくとスムーズ
   */
  static async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications.');
      return 'denied';
    }

    let permission = Notification.permission;
    if (permission === 'default') {
      permission = await Notification.requestPermission();
    }
    return permission;
  }

  /**
   * リマインダー通知を送信
   * @param title 通知タイトル
   * @param options NotificationOptions
   */
  static sendReminder(title: string, options?: NotificationOptions): void {
    if (!('Notification' in window)) {
      console.warn('Notifications API not supported');
      return;
    }

    if (Notification.permission === 'granted') {
      new Notification(title, options);
    } else if (Notification.permission !== 'denied') {
      // 権限未決定なら一度リクエスト
      Notification.requestPermission().then((perm) => {
        if (perm === 'granted') {
          new Notification(title, options);
        }
      });
    } else {
      console.warn('Notification permission denied');
    }
  }
}
