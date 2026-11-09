import { memo, useState, type ChangeEvent } from 'react';
import { useTaskActions } from '../context/TaskProvider';
import type { Member, Priority, Task } from '../types';

interface TaskItemProps {
  task: Task;
  projectName: string;
  assigneeName: string;
  members: Member[];
}

const PRIORITIES: Priority[] = ['low', 'medium', 'high'];

const dueDateFormatter = new Intl.DateTimeFormat(undefined, {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
});

function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function formatDueDate(dueDate: string): string {
  const [year, month, day] = dueDate.split('-').map(Number);

  return dueDateFormatter.format(new Date(year, month - 1, day));
}

function isPriority(value: string): value is Priority {
  return PRIORITIES.some((priority) => priority === value);
}

export const TaskItem = memo(function TaskItem({
  task,
  projectName,
  assigneeName,
  members,
}: TaskItemProps) {
  const { toggleTask, updateTask, deleteTask } = useTaskActions();
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const today = formatLocalDate(new Date());
  const isOverdue = !task.completed && task.dueDate < today;
  const displayedAssignee =
    task.assigneeId === null || assigneeName.trim() === ''
      ? 'Unassigned'
      : assigneeName;

  function handleAssigneeChange(event: ChangeEvent<HTMLSelectElement>) {
    const value = event.target.value;
    updateTask(task.id, { assigneeId: value === '' ? null : value });
  }

  function handlePriorityChange(event: ChangeEvent<HTMLSelectElement>) {
    const value = event.target.value;

    if (isPriority(value)) {
      updateTask(task.id, { priority: value });
    }
  }

  const statusLabel = task.completed
    ? 'Completed'
    : isOverdue
      ? 'Overdue'
      : 'Active';

  const cardClassName = [
    'dashboard-task',
    task.completed ? 'dashboard-task-completed' : '',
    isOverdue ? 'dashboard-task-overdue' : '',
  ]
    .filter((className) => className.length > 0)
    .join(' ');

  return (
    <article className={cardClassName} aria-label={task.title}>
      <div className="dashboard-task-main">
        <div className="dashboard-task-heading">
          <h3 className="dashboard-task-title">{task.title}</h3>
          <div className="dashboard-task-badges">
            <span
              className={`dashboard-badge dashboard-badge-status-${statusLabel.toLowerCase()}`}
              aria-label="Task status"
            >
              {statusLabel}
            </span>
            <span
              className={`dashboard-badge dashboard-badge-priority-${task.priority}`}
            >
              {task.priority}
            </span>
          </div>
        </div>

        <p className="dashboard-task-project">{projectName}</p>
        <p className="dashboard-task-meta">
          <span>Assignee: {displayedAssignee}</span>
          <span>
            Due:{' '}
            <time dateTime={task.dueDate}>{formatDueDate(task.dueDate)}</time>
          </span>
          <span>Priority: {task.priority}</span>
        </p>
      </div>

      <div className="dashboard-task-controls">
        <label className="dashboard-task-complete">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => toggleTask(task.id)}
          />
          Completed
        </label>

        <label className="dashboard-task-field">
          Assignee
          <select
            value={task.assigneeId ?? ''}
            onChange={handleAssigneeChange}
          >
            <option value="">Unassigned</option>
            {members.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name}
              </option>
            ))}
          </select>
        </label>

        <label className="dashboard-task-field">
          Priority
          <select value={task.priority} onChange={handlePriorityChange}>
            {PRIORITIES.map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>
        </label>

        {isConfirmingDelete ? (
          <div
            className="dashboard-task-confirm"
            role="group"
            aria-label="Confirm delete"
          >
            <p>Delete this task?</p>
            <button
              type="button"
              className="dashboard-task-button-danger"
              onClick={() => deleteTask(task.id)}
            >
              Confirm
            </button>
            <button
              type="button"
              className="dashboard-task-button-ghost"
              onClick={() => setIsConfirmingDelete(false)}
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="dashboard-task-button-ghost"
            onClick={() => setIsConfirmingDelete(true)}
          >
            Delete
          </button>
        )}
      </div>
    </article>
  );
});
