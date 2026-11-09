import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react';
import type { NewTask, Task } from '../types';
import {
  createInitialTaskState,
  tasksReducer,
  type FilterUpdate,
  type TaskState,
  type TaskUpdates,
} from '../state/tasksReducer';
import { loadFilters, loadTasks, saveFilters, saveTasks } from '../utils/taskStorage';

export interface TaskActions {
  addTask: (task: NewTask) => void;
  toggleTask: (id: string) => void;
  updateTask: (id: string, updates: TaskUpdates) => void;
  deleteTask: (id: string) => void;
  setFilter: (filter: FilterUpdate) => void;
}

const TaskStateContext = createContext<TaskState | null>(null);
const TaskActionsContext = createContext<TaskActions | null>(null);

interface TaskProviderProps {
  children: ReactNode;
}

export function TaskProvider({ children }: TaskProviderProps) {
  const [state, dispatch] = useReducer(tasksReducer, undefined, () => ({
    ...createInitialTaskState(loadTasks()),
    filters: loadFilters(),
  }));

  useEffect(() => {
    saveTasks(state.tasks);
  }, [state.tasks]);

  useEffect(() => {
    saveFilters(state.filters);
  }, [state.filters]);

  const addTask = useCallback((task: NewTask) => {
    const completeTask: Task = {
      ...task,
      id: crypto.randomUUID(),
      completed: false,
    };

    dispatch({ type: 'ADD_TASK', task: completeTask });
  }, []);

  const toggleTask = useCallback((id: string) => {
    dispatch({ type: 'TOGGLE_TASK', id });
  }, []);

  const updateTask = useCallback((id: string, updates: TaskUpdates) => {
    dispatch({ type: 'UPDATE_TASK', id, updates });
  }, []);

  const deleteTask = useCallback((id: string) => {
    dispatch({ type: 'DELETE_TASK', id });
  }, []);

  const setFilter = useCallback((filter: FilterUpdate) => {
    dispatch({ type: 'SET_FILTER', filter });
  }, []);

  const actions = useMemo<TaskActions>(
    () => ({
      addTask,
      toggleTask,
      updateTask,
      deleteTask,
      setFilter,
    }),
    [addTask, toggleTask, updateTask, deleteTask, setFilter],
  );

  return (
    <TaskStateContext.Provider value={state}>
      <TaskActionsContext.Provider value={actions}>
        {children}
      </TaskActionsContext.Provider>
    </TaskStateContext.Provider>
  );
}

export function useTaskState(): TaskState {
  const state = useContext(TaskStateContext);

  if (state === null) {
    throw new Error('useTaskState must be used within a TaskProvider');
  }

  return state;
}

export function useTaskActions(): TaskActions {
  const actions = useContext(TaskActionsContext);

  if (actions === null) {
    throw new Error('useTaskActions must be used within a TaskProvider');
  }

  return actions;
}
