import { useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import { useTaskActions } from '../context/TaskProvider';
import type { Priority, Project } from '../types';

interface CreateTaskFormProps {
  projects: Project[];
}

interface CreateTaskFormValues {
  title: string;
  projectId: string;
  priority: Priority;
  dueDate: string;
}

interface CreateTaskFormErrors {
  title?: string;
  projectId?: string;
  priority?: string;
  dueDate?: string;
}

const PRIORITIES: Priority[] = ['low', 'medium', 'high'];

function isPriority(value: string): value is Priority {
  return PRIORITIES.some((priority) => priority === value);
}

function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function validateCreateTaskForm(
  values: CreateTaskFormValues,
  projects: Project[],
): CreateTaskFormErrors {
  const errors: CreateTaskFormErrors = {};
  const trimmedTitle = values.title.trim();

  if (trimmedTitle.length === 0) {
    errors.title = 'Title is required.';
  } else if (trimmedTitle.length < 3) {
    errors.title = 'Title must be at least 3 characters.';
  } else if (trimmedTitle.length > 80) {
    errors.title = 'Title must be no more than 80 characters.';
  }

  const projectExists = projects.some((project) => project.id === values.projectId);
  if (!projectExists) {
    errors.projectId = 'Project is required.';
  }

  if (!isPriority(values.priority)) {
    errors.priority = 'Priority is invalid.';
  }

  if (values.dueDate.length === 0) {
    errors.dueDate = 'Due date is required.';
  } else {
    const today = formatLocalDate(new Date());
    if (values.dueDate < today) {
      errors.dueDate = 'Due date cannot be earlier than today.';
    }
  }

  return errors;
}

function hasValidationErrors(errors: CreateTaskFormErrors): boolean {
  return (
    errors.title !== undefined ||
    errors.projectId !== undefined ||
    errors.priority !== undefined ||
    errors.dueDate !== undefined
  );
}

export function CreateTaskForm({ projects }: CreateTaskFormProps) {
  const { addTask } = useTaskActions();

  const [title, setTitle] = useState('');
  const [projectId, setProjectId] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [dueDate, setDueDate] = useState('');

  const errors = useMemo(
    () => validateCreateTaskForm({ title, projectId, priority, dueDate }, projects),
    [title, projectId, priority, dueDate, projects],
  );

  function handlePriorityChange(event: ChangeEvent<HTMLSelectElement>) {
    const value = event.target.value;

    if (isPriority(value)) {
      setPriority(value);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const submissionErrors = validateCreateTaskForm(
      { title, projectId, priority, dueDate },
      projects,
    );

    if (hasValidationErrors(submissionErrors)) {
      return;
    }

    addTask({
      title: title.trim(),
      projectId,
      assigneeId: null,
      priority,
      dueDate,
    });

    setTitle('');
    setProjectId('');
    setPriority('medium');
    setDueDate('');
  }

  return (
    <form
      className="dashboard-create"
      onSubmit={handleSubmit}
      aria-label="Create task"
    >
      <div className="dashboard-create-header">
        <h2 className="dashboard-create-title">Create a new task</h2>
        <p className="dashboard-create-copy">
          Add a title, project, priority, and due date. New tasks start unassigned
          and incomplete.
        </p>
      </div>

      <div className="dashboard-create-grid">
        <div className="dashboard-create-field dashboard-create-field-title">
          <label>
            Title
            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              aria-invalid={errors.title !== undefined}
              aria-describedby={
                errors.title ? 'create-task-title-error' : undefined
              }
            />
          </label>
          {errors.title ? (
            <p id="create-task-title-error" className="dashboard-create-error">
              {errors.title}
            </p>
          ) : null}
        </div>

        <div className="dashboard-create-field">
          <label>
            Project
            <select
              value={projectId}
              onChange={(event) => setProjectId(event.target.value)}
              aria-invalid={errors.projectId !== undefined}
              aria-describedby={
                errors.projectId ? 'create-task-project-error' : undefined
              }
            >
              <option value="">Select a project</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </label>
          {errors.projectId ? (
            <p
              id="create-task-project-error"
              className="dashboard-create-error"
            >
              {errors.projectId}
            </p>
          ) : null}
        </div>

        <div className="dashboard-create-field">
          <label>
            Priority
            <select
              value={priority}
              onChange={handlePriorityChange}
              aria-invalid={errors.priority !== undefined}
              aria-describedby={
                errors.priority ? 'create-task-priority-error' : undefined
              }
            >
              {PRIORITIES.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          {errors.priority ? (
            <p
              id="create-task-priority-error"
              className="dashboard-create-error"
            >
              {errors.priority}
            </p>
          ) : null}
        </div>

        <div className="dashboard-create-field">
          <label>
            Due date
            <input
              type="date"
              value={dueDate}
              onChange={(event) => setDueDate(event.target.value)}
              aria-invalid={errors.dueDate !== undefined}
              aria-describedby={
                errors.dueDate ? 'create-task-due-date-error' : undefined
              }
            />
          </label>
          {errors.dueDate ? (
            <p id="create-task-due-date-error" className="dashboard-create-error">
              {errors.dueDate}
            </p>
          ) : null}
        </div>
      </div>

      <div className="dashboard-create-actions">
        <button
          type="submit"
          className="dashboard-create-submit"
          disabled={hasValidationErrors(errors)}
        >
          Add task
        </button>
      </div>
    </form>
  );
}
