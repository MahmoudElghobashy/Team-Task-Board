import { describe, expect, it } from 'vitest';
import type { Task } from '../types';
import {
  createInitialTaskState,
  tasksReducer,
  type TaskState,
} from './tasksReducer';

function createTask(overrides: Partial<Task> & Pick<Task, 'id'>): Task {
  return {
    title: 'Example task',
    projectId: 'p1',
    assigneeId: 'm1',
    priority: 'medium',
    dueDate: '2026-12-01',
    completed: false,
    ...overrides,
  };
}

function createState(tasks: Task[]): TaskState {
  return createInitialTaskState(tasks);
}

describe('tasksReducer', () => {
  it('adds a task without mutating the previous state or task objects', () => {
    const existing = createTask({ id: 't1' });
    const incoming = createTask({ id: 't2', title: 'New task' });
    const state = createState([existing]);
    const originalTasks = state.tasks;
    const originalTask = state.tasks[0];

    const next = tasksReducer(state, { type: 'ADD_TASK', task: incoming });

    expect(next).not.toBe(state);
    expect(next.tasks).not.toBe(originalTasks);
    expect(originalTasks).toHaveLength(1);
    expect(state.tasks[0]).toBe(originalTask);
    expect(originalTask).toEqual(createTask({ id: 't1' }));
    expect(next.tasks).toHaveLength(2);
    expect(next.tasks[1]).toEqual(incoming);
    expect(next.filters).toBe(state.filters);
  });

  it('toggles completion on the matching task and leaves other tasks shared', () => {
    const first = createTask({ id: 't1', completed: false });
    const second = createTask({ id: 't2', completed: true });
    const state = createState([first, second]);
    const originalSecond = state.tasks[1];

    const next = tasksReducer(state, { type: 'TOGGLE_TASK', id: 't1' });

    expect(next).not.toBe(state);
    expect(next.tasks).not.toBe(state.tasks);
    expect(state.tasks[0]?.completed).toBe(false);
    expect(next.tasks[0]).not.toBe(state.tasks[0]);
    expect(next.tasks[0]?.completed).toBe(true);
    expect(next.tasks[1]).toBe(originalSecond);
    expect(originalSecond?.completed).toBe(true);
  });

  it('updates assigneeId without mutating the original task', () => {
    const state = createState([createTask({ id: 't1', assigneeId: 'm1' })]);
    const originalTask = state.tasks[0];

    const next = tasksReducer(state, {
      type: 'UPDATE_TASK',
      id: 't1',
      updates: { assigneeId: null },
    });

    expect(next.tasks).not.toBe(state.tasks);
    expect(originalTask?.assigneeId).toBe('m1');
    expect(next.tasks[0]).not.toBe(originalTask);
    expect(next.tasks[0]?.assigneeId).toBe(null);
    expect(next.tasks[0]?.priority).toBe('medium');
  });

  it('updates priority without mutating the original task', () => {
    const state = createState([createTask({ id: 't1', priority: 'medium' })]);
    const originalTask = state.tasks[0];

    const next = tasksReducer(state, {
      type: 'UPDATE_TASK',
      id: 't1',
      updates: { priority: 'high' },
    });

    expect(originalTask?.priority).toBe('medium');
    expect(next.tasks[0]?.priority).toBe('high');
    expect(next.tasks[0]?.assigneeId).toBe('m1');
  });

  it('deletes a task by id without mutating the previous array', () => {
    const keep = createTask({ id: 'keep' });
    const remove = createTask({ id: 'remove' });
    const state = createState([keep, remove]);
    const originalTasks = state.tasks;

    const next = tasksReducer(state, { type: 'DELETE_TASK', id: 'remove' });

    expect(originalTasks).toHaveLength(2);
    expect(next.tasks).toHaveLength(1);
    expect(next.tasks[0]?.id).toBe('keep');
    expect(next.tasks).not.toBe(originalTasks);
    expect(originalTasks.map((task) => task.id)).toEqual(['keep', 'remove']);
  });

  it('updates a single filter field without mutating previous filters or tasks', () => {
    const state = createState([createTask({ id: 't1' })]);
    const originalFilters = state.filters;
    const originalTasks = state.tasks;

    const next = tasksReducer(state, {
      type: 'SET_FILTER',
      filter: { status: 'active' },
    });

    expect(next.filters).not.toBe(originalFilters);
    expect(originalFilters.status).toBe('all');
    expect(next.filters.status).toBe('active');
    expect(next.filters.projectId).toBe('all');
    expect(next.filters.search).toBe('');
    expect(next.tasks).toBe(originalTasks);
  });
});
