// src/models/Assignment.ts
import { Priority, Status } from './enums';

/**
 * 課題提出リマインドアプリのためのモデル定義
 */
export interface Assignment {
  /** 一意識別子(UUIDなど) */
  id: string;
  /** 課題名 */
  title: string;
  /** 課題内容 */
  content: string;
  /** 締め切り日 */
  dueDate: Date;
  /** 備考欄（任意） */
  remarks?: string;
  /** 優先度 */
  priority: Priority;
  /** 進行度 */
  status: Status;
}

/**
 * Assignment のインスタンス操作用ユーティリティクラス
 */
export class AssignmentModel implements Assignment {
  id: string;
  title: string;
  content: string;
  dueDate: Date;
  remarks?: string;
  priority: Priority;
  status: Status;

  /**
   * @param data.dueDate は文字列、数値、Date オブジェクトを受け付けます
   */
  constructor(data: Omit<Assignment, 'id' | 'dueDate'> & { id?: string; dueDate: string | number | Date }) {
    this.id = data.id ?? crypto.randomUUID();
    this.title = data.title;
    this.content = data.content;
    this.dueDate = data.dueDate instanceof Date
      ? data.dueDate
      : new Date(data.dueDate);
    this.remarks = data.remarks;
    this.priority = data.priority;
    this.status = data.status;
  }

  setPriority(priority: Priority) {
    this.priority = priority;
  }

  setStatus(status: Status) {
    this.status = status;
  }
}
