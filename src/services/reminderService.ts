// TODO: Implement reminderService.ts
// src/services/reminderService.ts
import { AssignmentModel } from '../models/Assignment';
import { NotificationService } from './notificationService';
import { isTomorrow, getNextMidnightDelay } from '../utils/dateUtils';

/**
 * リマインダー用スケジューラサービス
 * 毎日 0:00 に「締切前日」の課題をチェックし、通知を送信します。
 */
export class ReminderService {
  /**
   * 毎日 0:00 に課題をチェックして通知をスケジュールします。
   * @param getAssignments 課題リストを返すコールバック
   */
  static scheduleDailyReminders(getAssignments: () => AssignmentModel[]): void {
    // 初回起動時に通知権限をリクエスト
    NotificationService.requestPermission();

    const checkAndNotify = () => {
      const assignments = getAssignments();
      assignments.forEach((assignment) => {
        if (isTomorrow(assignment.dueDate)) {
          NotificationService.sendReminder(
            `〆切前日: ${assignment.title}`,
            { body: assignment.content }
          );
        }
      });
    };

    // 次の 0:00 までの遅延を計算
    const initialDelay = getNextMidnightDelay();

    // 初回実行をタイマー登録
    setTimeout(() => {
      checkAndNotify();
      // 以降は 24h ごとに実行
      setInterval(checkAndNotify, 24 * 60 * 60 * 1000);
    }, initialDelay);
  }
}
