import { sampleTasks } from '../data/sampleTasks';
import type { Priority, Task } from '../types';

export type StatusFilter = 'all' | 'active' | 'completed';

export interface TaskFilters {
  status: StatusFilter;
  projectId: string;
  search: string;
}

export interface TaskState {
  tasks: Task[];
  filters: TaskFilters;
}

export type TaskUpdates =
  | { assigneeId: string | null }
  | { priority: Priority };

export type FilterUpdate =
  | { status: StatusFilter }
  | { projectId: string }
  | { search: string };

export type TaskAction =
  | { type: 'ADD_TASK'; task: Task }
  | { type: 'TOGGLE_TASK'; id: string }
  | { type: 'UPDATE_TASK'; id: string; updates: TaskUpdates }
  | { type: 'DELETE_TASK'; id: string }
  | { type: 'SET_FILTER'; filter: FilterUpdate };

const defaultFilters: TaskFilters = {
  status: 'all',
  projectId: 'all',
  search: '',
};

export function createInitialTaskState(tasks: Task[] = sampleTasks): TaskState {
  return {
    tasks: tasks.map((task) => ({ ...task })),
    filters: { ...defaultFilters },
  };
}

function applyTaskUpdates(task: Task, updates: TaskUpdates): Task {
  if ('assigneeId' in updates) {
    return { ...task, assigneeId: updates.assigneeId };
  }

  return { ...task, priority: updates.priority };
}

export function tasksReducer(state: TaskState, action: TaskAction): TaskState {
  switch (action.type) {
    case 'ADD_TASK':
      return {
        ...state,
        tasks: [...state.tasks, action.task],
      };

    case 'TOGGLE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.id ? { ...task, completed: !task.completed } : task,
        ),
      };

    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.id ? applyTaskUpdates(task, action.updates) : task,
        ),
      };

    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.id),
      };

    case 'SET_FILTER':
      return {
        ...state,
        filters: { ...state.filters, ...action.filter },
      };

    default: {
      const exhaustiveCheck: never = action;
      return exhaustiveCheck;
    }
  }
}
