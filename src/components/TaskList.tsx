import { useVisibleTasks } from '../hooks/useVisibleTasks';
import type { Member, Project } from '../types';
import { TaskItem } from './TaskItem';

interface TaskListProps {
  members: Member[];
  projects: Project[];
}

function getProjectName(projects: Project[], projectId: string): string {
  const project = projects.find((item) => item.id === projectId);
  return project ? project.name : 'Unknown project';
}

function getAssigneeName(members: Member[], assigneeId: string | null): string {
  if (assigneeId === null) {
    return '';
  }

  const member = members.find((item) => item.id === assigneeId);
  return member ? member.name : 'Unknown member';
}

export function TaskList({ members, projects }: TaskListProps) {
  const visibleTasks = useVisibleTasks();

  if (visibleTasks.length === 0) {
    return (
      <div className="dashboard-task-empty">
        <p className="dashboard-task-empty-title">No tasks found.</p>
        <p className="dashboard-task-empty-copy">
          Try a different status, project, or search, or create a new task above.
        </p>
      </div>
    );
  }

  return (
    <ul className="dashboard-task-list">
      {visibleTasks.map((task) => (
        <li key={task.id} className="dashboard-task-list-item">
          <TaskItem
            task={task}
            projectName={getProjectName(projects, task.projectId)}
            assigneeName={getAssigneeName(members, task.assigneeId)}
            members={members}
          />
        </li>
      ))}
    </ul>
  );
}
