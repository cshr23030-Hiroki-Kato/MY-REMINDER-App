import * as React from 'react';
import { AssignmentModel } from '../models/Assignment';

export interface AssignmentItemProps {
  assignment: AssignmentModel;
  onEdit:     (assignment: AssignmentModel) => void;
  onDelete:   (id: string) => void;
}

export const AssignmentItem: React.FC<AssignmentItemProps> = ({
  assignment,
  onEdit,
  onDelete
}) => {
  const { id, title, dueDate, priority, status } = assignment;

  return (
    <div className="assignment-item">
      <h3>{title}</h3>
      <p>締め切り: {dueDate.toLocaleDateString()}</p>
      <p>優先度: {priority}</p>
      <p>進行度: {status}</p>
      <button onClick={() => onEdit(assignment)}>編集</button>
      <button onClick={() => onDelete(id)}>削除</button>
    </div>
  );
};
