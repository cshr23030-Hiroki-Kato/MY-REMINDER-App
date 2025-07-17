// src/utils/dateUtils.ts

/**
 * 与えられた日付が「明日」かどうか判定します。
 * @param date 判定対象の日付
 * @returns 明日であれば true、そうでなければ false
 */
export function isTomorrow(date: Date): boolean {
  const today = new Date();
  // 今日の日付を取得
  const y = today.getFullYear();
  const m = today.getMonth();
  const d = today.getDate();

  // 今日の 00:00 と明日の 00:00 を計算
  const startOfTomorrow = new Date(y, m, d + 1, 0, 0, 0, 0);
  const startOfDayAfter = new Date(y, m, d + 2, 0, 0, 0, 0);

  return date >= startOfTomorrow && date < startOfDayAfter;
}

/**
 * 次の午前0時までの遅延時間（ミリ秒）を計算します。
 * これは setTimeout の第1引数に渡すことで、次の 0:00 にコールバックを実行できます。
 * @returns 次の午前0時までのミリ秒
 */
export function getNextMidnightDelay(): number {
  const now = new Date();
  // 明日の 00:00 を作成
  const midnight = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
    0, 0, 0, 0
  );
  return midnight.getTime() - now.getTime();
}
