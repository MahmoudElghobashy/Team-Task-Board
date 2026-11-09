export type Priority = 'low' | 'medium' | 'high';
export interface Member {
id: string;
name: string;
}
export interface Project {
id: string;
name: string;
}
export interface Task {
id: string;
title: string;
projectId: string;
assigneeId: string | null;
priority: Priority;
dueDate: string; // YYYY-MM-DD
completed: boolean;
}
export type NewTask = Omit<Task, 'id' | 'completed'>;