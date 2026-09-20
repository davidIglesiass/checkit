export const ROLE_NAMES = ['user', 'admin'] as const
export type RoleName = (typeof ROLE_NAMES)[number]

export const TASK_STATUSES = ['pending', 'in_progress', 'done'] as const
export type TaskStatus = (typeof TASK_STATUSES)[number]

export const TASK_PRIORITIES = ['low', 'medium', 'high'] as const
export type TaskPriority = (typeof TASK_PRIORITIES)[number]
