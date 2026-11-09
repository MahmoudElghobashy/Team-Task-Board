import { useMemo } from 'react';
import { useTaskState } from '../context/TaskProvider';

function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function TaskSummary() {
  const { tasks } = useTaskState();

  const { total, completed, overdue } = useMemo(() => {
    const today = formatLocalDate(new Date());
    let completedCount = 0;
    let overdueCount = 0;

    for (const task of tasks) {
      if (task.completed) {
        completedCount += 1;
        continue;
      }

      if (task.dueDate < today) {
        overdueCount += 1;
      }
    }

    return {
      total: tasks.length,
      completed: completedCount,
      overdue: overdueCount,
    };
  }, [tasks]);

  return (
    <section className="dashboard-summary" aria-label="Task summary">
      <article
        className="dashboard-summary-card dashboard-summary-card-total"
        aria-labelledby="dashboard-summary-total-label"
      >
        <span className="dashboard-summary-mark" aria-hidden="true">
          T
        </span>
        <div className="dashboard-summary-copy">
          <p id="dashboard-summary-total-label" className="dashboard-summary-label">
            Total Tasks
          </p>
          <p className="dashboard-summary-value">{total}</p>
        </div>
      </article>

      <article
        className="dashboard-summary-card dashboard-summary-card-completed"
        aria-labelledby="dashboard-summary-completed-label"
      >
        <span className="dashboard-summary-mark" aria-hidden="true">
          C
        </span>
        <div className="dashboard-summary-copy">
          <p
            id="dashboard-summary-completed-label"
            className="dashboard-summary-label"
          >
            Completed Tasks
          </p>
          <p className="dashboard-summary-value">{completed}</p>
        </div>
      </article>

      <article
        className="dashboard-summary-card dashboard-summary-card-overdue"
        aria-labelledby="dashboard-summary-overdue-label"
      >
        <span className="dashboard-summary-mark" aria-hidden="true">
          O
        </span>
        <div className="dashboard-summary-copy">
          <p
            id="dashboard-summary-overdue-label"
            className="dashboard-summary-label"
          >
            Overdue Tasks
          </p>
          <p className="dashboard-summary-value">{overdue}</p>
        </div>
      </article>
    </section>
  );
}
