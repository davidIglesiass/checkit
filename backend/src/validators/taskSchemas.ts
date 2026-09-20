import { z } from 'zod'
import { TASK_STATUSES, TASK_PRIORITIES } from '../types.ts'

export const createTaskSchema = z.object({
    title: z.string().trim().min(1, 'El titulo es obligatorio'),
    description: z.string().trim().optional(),
    status: z.enum(TASK_STATUSES).optional(),
    priority: z.enum(TASK_PRIORITIES).optional(),
    dueDate: z.coerce.date().optional(),
    tags: z.array(z.string()).optional()
})

export const updateTaskSchema = createTaskSchema.partial()

export type CreateTaskInput = z.infer<typeof createTaskSchema>
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>
