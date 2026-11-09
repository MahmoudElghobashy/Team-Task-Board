import type { ReactNode } from 'react';
import { CreateTaskForm } from './components/CreateTaskForm';
import { TaskFilters } from './components/TaskFilters';
import { TaskList } from './components/TaskList';
import { TaskSummary } from './components/TaskSummary';
import { TaskProvider } from './context/TaskProvider';
import { useReferenceData } from './hooks/useReferenceData';
import './styles/dashboard.css';

function DashboardShell({ children }: { children: ReactNode }) {
  return (
    <div className="dashboard-shell">
      <aside className="dashboard-sidebar">
        <div className="dashboard-brand">
          <span className="dashboard-logo" aria-hidden="true">
            T
          </span>
          <span className="dashboard-brand-name">TeamFlow</span>
        </div>
        <nav className="dashboard-nav" aria-label="Workspace">
          <ul className="dashboard-nav-list">
            <li>
              <span className="dashboard-nav-item dashboard-nav-item-active">
                Task Board
              </span>
            </li>
          </ul>
        </nav>
      </aside>

      <div className="dashboard-main">
        <header className="dashboard-header">
          <p className="dashboard-eyebrow">WORKSPACE</p>
          <h1 className="dashboard-title">Team Task Board</h1>
          <p className="dashboard-subtitle">
            Organize work, track progress, and keep your team aligned.
          </p>
        </header>
        <div className="dashboard-content">{children}</div>
      </div>
    </div>
  );
}

function TaskBoard() {
  const { state, retry } = useReferenceData();

  let content: ReactNode;

  if (state.status === 'loading') {
    content = (
      <div className="dashboard-status">
        <p>Loading members and projects...</p>
      </div>
    );
  } else if (state.status === 'error') {
    content = (
      <div className="dashboard-status">
        <p>{state.message}</p>
        <button type="button" onClick={retry}>
          Retry
        </button>
      </div>
    );
  } else {
    content = (
      <>
        <TaskSummary />
        <CreateTaskForm projects={state.projects} />
        <TaskFilters projects={state.projects} />
        <TaskList members={state.members} projects={state.projects} />
      </>
    );
  }

  return <DashboardShell>{content}</DashboardShell>;
}

function App() {
  return (
    <TaskProvider>
      <TaskBoard />
    </TaskProvider>
  );
}

export default App;
