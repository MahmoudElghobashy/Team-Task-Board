import type { Task } from '../types';
export const sampleTasks: Task[] = [
{ id: 's1', title: 'Fix login crash on Android 14', projectId: 'p1', assigneeId: 'm2', priority:
'high', dueDate: '2026-11-05', completed: false },
{ id: 's2', title: 'Add invoice PDF download', projectId: 'p2', assigneeId: 'm1', priority:
    'medium', dueDate: '2026-11-12', completed: false },
    { id: 's3', title: 'Clean up unused feature flags', projectId: 'p3', assigneeId: null, priority:
    'low', dueDate: '2026-11-20', completed: false },
    { id: 's4', title: 'Update onboarding screens copy', projectId: 'p1', assigneeId: 'm3', priority:
    'medium', dueDate: '2026-10-30', completed: true },
    ];