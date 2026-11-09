import { useMemo } from 'react';
import { useTaskState } from '../context/TaskProvider';
import type { Task } from '../types';
import { useDebouncedValue } from './useDebouncedValue';

function matchesStatus(task: Task, status: 'all' | 'active' | 'completed'): boolean {
  if (status === 'all') {
    return true;
  }

  if (status === 'active') {
    return !task.completed;
  }

  return task.completed;
}

function matchesProject(task: Task, projectId: string): boolean {
  return projectId === 'all' || task.projectId === projectId;
}

function matchesSearch(task: Task, search: string): boolean {
  const query = search.trim().toLowerCase();

  if (query.length === 0) {
    return true;
  }

  return task.title.toLowerCase().includes(query);
}

function compareVisibleTasks(a: Task, b: Task): number {
  if (a.completed !== b.completed) {
    return a.completed ? 1 : -1;
  }

  if (a.dueDate < b.dueDate) {
    return -1;
  }

  if (a.dueDate > b.dueDate) {
    return 1;
  }

  return 0;
}

export function useVisibleTasks(): Task[] {
  const { tasks, filters } = useTaskState();
  const debouncedSearch = useDebouncedValue(filters.search, 300);

  return useMemo(() => {
    return tasks
      .filter(
        (task) =>
          matchesStatus(task, filters.status) &&
          matchesProject(task, filters.projectId) &&
          matchesSearch(task, debouncedSearch),
      )
      .sort(compareVisibleTasks);
  }, [tasks, filters.status, filters.projectId, debouncedSearch]);
}
