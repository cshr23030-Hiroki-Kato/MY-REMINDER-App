// src/components/AssignmentForm.tsx
import React from 'react';
import { useForm, Controller, ControllerRenderProps } from 'react-hook-form';
import { Priority, Status } from '../models/enums';
import { AssignmentModel, Assignment } from '../models/Assignment';

// フォームで扱う値の型定義
export interface FormValues {
  title: string;
  content: string;
  dueDate: string;      // input type=date なので string (YYYY-MM-DD)
  remarks?: string;
  priority: Priority;
  status: Status;
}

export interface AssignmentFormProps {
  onSubmit: (assignment: AssignmentModel) => void;
  initialData?: Assignment;
}

export const AssignmentForm: React.FC<AssignmentFormProps> = ({ onSubmit, initialData }) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: initialData
      ? {
          title: initialData.title,
          content: initialData.content,
          dueDate: initialData.dueDate.toISOString().slice(0, 10),
          remarks: initialData.remarks || '',
          priority: initialData.priority,
          status: initialData.status,
        }
      : {
          title: '',
          content: '',
          dueDate: new Date().toISOString().slice(0, 10),
          remarks: '',
          priority: Priority.MEDIUM,
          status: Status.NOT_STARTED,
        },
  });

  const submitHandler = (data: FormValues) => {
    // dueDate は string のため、AssignmentModel でパースされる
    const assignment = new AssignmentModel({
      title: data.title,
      content: data.content,
      dueDate: data.dueDate,
      remarks: data.remarks,
      priority: data.priority,
      status: data.status,
    });
    onSubmit(assignment);
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="assignment-form">
      <div>
        <label htmlFor="title">課題名</label>
        <input id="title" {...register('title', { required: '課題名は必須です' })} />
        {errors.title && <span>{errors.title.message}</span>}
      </div>

      <div>
        <label htmlFor="content">課題内容</label>
        <textarea id="content" {...register('content')} />
      </div>

      <div>
        <label htmlFor="dueDate">締め切り日</label>
        <input id="dueDate" type="date" {...register('dueDate', { required: '締め切り日は必須です' })} />
        {errors.dueDate && <span>{errors.dueDate.message}</span>}
      </div>

      <div>
        <label htmlFor="remarks">備考</label>
        <input id="remarks" {...register('remarks')} />
      </div>

      <div>
        <label htmlFor="priority">優先度</label>
        <Controller
          control={control}
          name="priority"
          render={({ field }: { field: ControllerRenderProps<FormValues, 'priority'> }) => (
            <select {...field} id="priority">
              {Object.values(Priority).map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          )}
        />
      </div>

      <div>
        <label htmlFor="status">進行度</label>
        <Controller
          control={control}
          name="status"
          render={({ field }: { field: ControllerRenderProps<FormValues, 'status'> }) => (
            <select {...field} id="status">
              {Object.values(Status).map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          )}
        />
      </div>

      <button type="submit">保存</button>
    </form>
  );
};
