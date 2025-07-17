// src/App.tsx
import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Priority, Status } from './models/enums';
import { AssignmentModel } from './models/Assignment';
import { AssignmentForm } from './components/AssignmentForm';
import { AssignmentList } from './components/AssignmentList';
import { CalendarService } from './services/calendarService';
import { NotificationService } from './services/notificationService';
import { ReminderService } from './services/reminderService';

console.log('🔵 App.tsx rendered');

export const App: React.FC = () => {
  // 課題リスト状態
  const [assignments, setAssignments] = useState<AssignmentModel[]>([]);
  // 編集モード対象
  const [editing, setEditing] = useState<AssignmentModel | null>(null);

  // 最新の assignments を参照する ref
  const assignmentsRef = useRef<AssignmentModel[]>(assignments);
  useEffect(() => {
    assignmentsRef.current = assignments;
  }, [assignments]);

  // --- フィルター用 state ('ALL' は全件) ---
  const [filterPriority, setFilterPriority] = useState<Priority | 'ALL'>('ALL');
  const [filterStatus, setFilterStatus]     = useState<Status   | 'ALL'>('ALL');

  // フィルター適用後のリスト
  const visible = assignments.filter(a => {
    const okP = filterPriority === 'ALL' || a.priority === filterPriority;
    const okS = filterStatus   === 'ALL' || a.status   === filterStatus;
    return okP && okS;
  });

  /** 課題の追加または更新ハンドラ */
  const handleSave = async (assignment: AssignmentModel) => {
    if (editing) {
      setAssignments(prev => prev.map(a => (a.id === assignment.id ? assignment : a)));
    } else {
      setAssignments(prev => [...prev, assignment]);
    }

    try {
      await CalendarService.syncToGoogleCalendar(assignment);
    } catch (error) {
      console.error('Google Calendar sync error:', error);
    }

    setEditing(null);
  };

  /** 編集モード開始 */
  const handleEdit = (assignment: AssignmentModel) => {
    setEditing(assignment);
  };

  /** 課題削除 */
  const handleDelete = (id: string) => {
    setAssignments(prev => prev.filter(a => a.id !== id));
  };

  // アプリ起動時に通知権限と定期リマインダーをセット
  useEffect(() => {
    NotificationService.requestPermission();
    ReminderService.scheduleDailyReminders(() => assignmentsRef.current);
  }, []);

  return (
    <div className="app-container">
      <h1>課題提出リマインダー</h1>

      {/* --- フィルターUI --- */}
      <div className="filters">
        <label>
          優先度:
          <select
            value={filterPriority}
            onChange={e => setFilterPriority(e.target.value as Priority | 'ALL')}
          >
            <option value="ALL">すべて</option>
            {Object.values(Priority).map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </label>

        <label>
          進行度:
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value as Status | 'ALL')}
          >
            <option value="ALL">すべて</option>
            {Object.values(Status).map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </label>
      </div>

      {/* --- 課題フォーム & 一覧 --- */}
      <AssignmentForm onSubmit={handleSave} initialData={editing || undefined} />
      <AssignmentList
        assignments={visible}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default App;
