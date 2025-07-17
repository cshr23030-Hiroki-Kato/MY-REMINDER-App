import * as React from 'react';
import { AssignmentModel } from '../models/Assignment';
import { AssignmentItem }    from './AssignmentItem';

export interface AssignmentListProps {
  assignments: AssignmentModel[];            // ← ここを Assignment から AssignmentModel[] に
  onEdit:      (assignment: AssignmentModel) => void;  // ← 引数の型も合わせて
  onDelete:    (id: string) => void;
}

export const AssignmentList: React.FC<AssignmentListProps> = ({
  assignments,
  onEdit,
  onDelete
}) => {
  if (assignments.length === 0) {
    return <p>まだ登録された課題はありません。</p>;
  }

  return (
    <div className="assignment-list">
      {assignments.map((a) => (
        <AssignmentItem
          key={a.id}
          assignment={a}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
