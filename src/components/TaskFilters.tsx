import { type ChangeEvent } from 'react';
import { useTaskActions, useTaskState } from '../context/TaskProvider';
import type { StatusFilter } from '../state/tasksReducer';
import type { Project } from '../types';

interface TaskFiltersProps {
  projects: Project[];
}

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
];

function isStatusFilter(value: string): value is StatusFilter {
  return STATUS_OPTIONS.some((option) => option.value === value);
}

export function TaskFilters({ projects }: TaskFiltersProps) {
  const { filters } = useTaskState();
  const { setFilter } = useTaskActions();

  function handleStatusChange(event: ChangeEvent<HTMLSelectElement>) {
    const value = event.target.value;

    if (isStatusFilter(value)) {
      setFilter({ status: value });
    }
  }

  function handleProjectChange(event: ChangeEvent<HTMLSelectElement>) {
    setFilter({ projectId: event.target.value });
  }

  function handleSearchChange(event: ChangeEvent<HTMLInputElement>) {
    setFilter({ search: event.target.value });
  }

  return (
    <section className="dashboard-filters" aria-label="Task filters">
      <h2 className="dashboard-filters-title">Filter tasks</h2>

      <div className="dashboard-filters-row">
        <label className="dashboard-filters-control dashboard-filters-status">
          Status
          <select value={filters.status} onChange={handleStatusChange}>
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="dashboard-filters-control dashboard-filters-project">
          Project
          <select value={filters.projectId} onChange={handleProjectChange}>
            <option value="all">All projects</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </label>

        <label className="dashboard-filters-control dashboard-filters-search">
          Search
          <input
            type="search"
            value={filters.search}
            onChange={handleSearchChange}
          />
        </label>
      </div>
    </section>
  );
}
