# NOTES.md

### 1. Reducer vs useState

This app keeps tasks and filters in one `TaskState` and updates them through five related actions (`ADD_TASK`, `TOGGLE_TASK`, `UPDATE_TASK`, `DELETE_TASK`, `SET_FILTER`). `useReducer` is a better fit than several `useState` calls because all of those updates live in one pure `tasksReducer` switch, always return new objects and arrays, and can be unit-tested without React. Task IDs are not created in the reducer: `TaskProvider.addTask` calls `crypto.randomUUID()`, sets `completed: false`, and then dispatches a complete `Task`. That keeps the reducer deterministic and free of side effects.

### 2. Separate Contexts

`TaskProvider` exposes `TaskStateContext` for `state` and `TaskActionsContext` for a memoized `TaskActions` object. The action functions are wrapped in `useCallback` (they only call a stable `dispatch`) and combined with `useMemo`, so the actions value does not change when tasks or filters change. Components that only use `useTaskActions()` do not re-render because of task state changes through the actions context, since its value remains stable. In addition, `React.memo` helps prevent unnecessary re-renders when their props remain unchanged. while `useTaskState()` consumers still re-render when state changes.

### 3. Reference Data Loading

`useReferenceData` starts as `{ status: 'loading' }` and, on mount, loads members and projects together with `Promise.all([fetchMembers(), fetchProjects()])`. Both requests succeeding becomes `{ status: 'ready', members, projects }`; either failing becomes `{ status: 'error', message }` from an `unknown` catch. `retry` calls the same `load` function. `inFlightRef` ignores a new `load` or `retry` while a request is already running. Each start increments `requestIdRef` so an older response cannot update state after a newer request. Effect cleanup sets `isMountedRef` to false so `setState` does not run after unmount. `finally` clears the in-flight flag only if that request is still the current one.

### 4. Future Improvement

`saveFilters(state.filters)` currently runs on every filter change, including each search keystroke. Debouncing that `localStorage` write (similar to the 300ms debounce already used for search in `useVisibleTasks`) would reduce storage writes while keeping the search input and reducer updates immediate.
