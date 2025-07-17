// src/services/calendarService.ts
import { gapi } from 'gapi-script';
import { Assignment } from '../models/Assignment';

/**
 * Google Calendar API と連携し、課題の締め切り日時をカレンダーに自動追加するサービス
 */
export class CalendarService {
  private static CLIENT_ID: string = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  private static API_KEY:   string = import.meta.env.VITE_GOOGLE_API_KEY;
  private static DISCOVERY_DOCS = [
    'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'
  ];
  private static SCOPES = 'https://www.googleapis.com/auth/calendar.events';
  private static initialized = false;

  /**
   * GAPI クライアントの初期化
   */
  static async initClient(): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      gapi.load('client:auth2', async () => {
        try {
          await gapi.client.init({
            apiKey: CalendarService.API_KEY,
            clientId: CalendarService.CLIENT_ID,
            discoveryDocs: CalendarService.DISCOVERY_DOCS,
            scope: CalendarService.SCOPES,
          });
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    });
    CalendarService.initialized = true;
  }

  /**
   * 課題を Google カレンダーに登録
   * @param a Assignment モデル
   */
  static async syncToGoogleCalendar(a: Assignment): Promise<any> {
  if (!CalendarService.initialized) {
    await CalendarService.initClient();
  }

  const authInstance = gapi.auth2.getAuthInstance();
  if (!authInstance.isSignedIn.get()) {
    await authInstance.signIn();
  }

  // イベントのリソースを作成
  const startDate = new Date(a.dueDate);
  startDate.setHours(3, 0, 0, 0);
  const endDate = new Date(a.dueDate);
  endDate.setHours(3, 10, 0, 0);

  const eventResource = {
    summary:     a.title,
    description: a.content,
    start:       { dateTime: startDate.toISOString() },
    end:         { dateTime: endDate.toISOString() },
  };

  // 型定義が足りない gapi.client.calendar を any 経由で呼び出し
  const calendarClient = (gapi.client as any).calendar;
  const response = await calendarClient.events.insert({
    calendarId: 'primary',
    resource:   eventResource,
  });

  return response.result;
}
}
