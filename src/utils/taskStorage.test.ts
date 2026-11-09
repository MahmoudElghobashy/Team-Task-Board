import { beforeEach, describe, expect, it } from 'vitest';
import { sampleTasks } from '../data/sampleTasks';
import type { TaskFilters } from '../state/tasksReducer';
import type { Task } from '../types';
import {
  FILTERS_STORAGE_KEY,
  TASKS_STORAGE_KEY,
  loadFilters,
  loadTasks,
} from './taskStorage';

const validTask: Task = {
  id: 'stored-1',
  title: 'Persisted task',
  projectId: 'p2',
  assigneeId: null,
  priority: 'low',
  dueDate: '2026-12-15',
  completed: false,
};

const validFilters: TaskFilters = {
  status: 'completed',
  projectId: 'p1',
  search: 'invoice',
};

beforeEach(() => {
  localStorage.clear();
});

describe('loadTasks', () => {
  it('returns parsed tasks when localStorage holds a valid task array', () => {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify([validTask]));

    const loaded = loadTasks();

    expect(loaded).toEqual([validTask]);
    expect(loaded).not.toBe(sampleTasks);
  });

  it('returns sampleTasks when no tasks are stored', () => {
    expect(localStorage.getItem(TASKS_STORAGE_KEY)).toBeNull();
    expect(loadTasks()).toBe(sampleTasks);
  });

  it('returns sampleTasks when stored JSON is invalid', () => {
    localStorage.setItem(TASKS_STORAGE_KEY, '{not-json');

    expect(loadTasks()).toBe(sampleTasks);
  });

  it('returns sampleTasks when JSON is valid but the task shape is not', () => {
    localStorage.setItem(
      TASKS_STORAGE_KEY,
      JSON.stringify([
        {
          id: 1,
          title: 'Broken',
          projectId: 'p1',
        },
      ]),
    );

    expect(loadTasks()).toBe(sampleTasks);
  });
});

describe('loadFilters', () => {
  it('returns parsed filters when localStorage holds a valid filters object', () => {
    localStorage.setItem(FILTERS_STORAGE_KEY, JSON.stringify(validFilters));

    expect(loadFilters()).toEqual(validFilters);
  });

  it('returns default filters when none are stored', () => {
    expect(localStorage.getItem(FILTERS_STORAGE_KEY)).toBeNull();
    expect(loadFilters()).toEqual({
      status: 'all',
      projectId: 'all',
      search: '',
    });
  });

  it('returns default filters when stored JSON is invalid', () => {
    localStorage.setItem(FILTERS_STORAGE_KEY, 'not-json');

    expect(loadFilters()).toEqual({
      status: 'all',
      projectId: 'all',
      search: '',
    });
  });

  it('returns default filters when JSON is valid but the filter shape is not', () => {
    localStorage.setItem(
      FILTERS_STORAGE_KEY,
      JSON.stringify({ status: 'done', projectId: 'p1', search: '' }),
    );

    expect(loadFilters()).toEqual({
      status: 'all',
      projectId: 'all',
      search: '',
    });
  });
});
