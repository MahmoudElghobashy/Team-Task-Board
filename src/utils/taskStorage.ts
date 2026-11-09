import { sampleTasks } from '../data/sampleTasks';
import type { StatusFilter, TaskFilters } from '../state/tasksReducer';
import type { Priority, Task } from '../types';

export const TASKS_STORAGE_KEY = 'team-task-board-tasks';
export const FILTERS_STORAGE_KEY = 'team-task-board-filters';

const defaultFilters: TaskFilters = {
  status: 'all',
  projectId: 'all',
  search: '',
};

function isPriority(value: unknown): value is Priority {
  return value === 'low' || value === 'medium' || value === 'high';
}

function isTask(value: unknown): value is Task {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  if (!('id' in value) || typeof value.id !== 'string') {
    return false;
  }

  if (!('title' in value) || typeof value.title !== 'string') {
    return false;
  }

  if (!('projectId' in value) || typeof value.projectId !== 'string') {
    return false;
  }

  if (
    !('assigneeId' in value) ||
    (typeof value.assigneeId !== 'string' && value.assigneeId !== null)
  ) {
    return false;
  }

  if (!('priority' in value) || !isPriority(value.priority)) {
    return false;
  }

  if (!('dueDate' in value) || typeof value.dueDate !== 'string') {
    return false;
  }

  if (!('completed' in value) || typeof value.completed !== 'boolean') {
    return false;
  }

  return true;
}

export function isTaskArray(value: unknown): value is Task[] {
  return Array.isArray(value) && value.every(isTask);
}

export function loadTasks(): Task[] {
  try {
    const raw = localStorage.getItem(TASKS_STORAGE_KEY);

    if (raw === null) {
      return sampleTasks;
    }

    const parsed: unknown = JSON.parse(raw);

    if (!isTaskArray(parsed)) {
      return sampleTasks;
    }

    return parsed;
  } catch {
    return sampleTasks;
  }
}

export function saveTasks(tasks: Task[]): void {
  try {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  } catch {
    // Ignore quota, private-mode, and other storage failures.
  }
}

function isStatusFilter(value: unknown): value is StatusFilter {
  return value === 'all' || value === 'active' || value === 'completed';
}

export function isTaskFilters(value: unknown): value is TaskFilters {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  if (!('status' in value) || !isStatusFilter(value.status)) {
    return false;
  }

  if (!('projectId' in value) || typeof value.projectId !== 'string') {
    return false;
  }

  if (!('search' in value) || typeof value.search !== 'string') {
    return false;
  }

  return true;
}

export function loadFilters(): TaskFilters {
  try {
    const raw = localStorage.getItem(FILTERS_STORAGE_KEY);

    if (raw === null) {
      return { ...defaultFilters };
    }

    const parsed: unknown = JSON.parse(raw);

    if (!isTaskFilters(parsed)) {
      return { ...defaultFilters };
    }

    return parsed;
  } catch {
    return { ...defaultFilters };
  }
}

export function saveFilters(filters: TaskFilters): void {
  try {
    localStorage.setItem(FILTERS_STORAGE_KEY, JSON.stringify(filters));
  } catch {
    // Ignore quota, private-mode, and other storage failures.
  }
}
