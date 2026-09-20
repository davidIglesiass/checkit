import { z } from 'zod'
import { ROLE_NAMES } from '../types.ts'

export const signUpSchema = z.object({
    username: z.string().trim().min(1),
    email: z.string().trim().email(),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
    roles: z.array(z.enum(ROLE_NAMES)).optional()
})

export const signInSchema = z.object({
    email: z.string().trim().email(),
    password: z.string().min(1, 'Campo password obligatorio')
})

export type SignUpInput = z.infer<typeof signUpSchema>
export type SignInInput = z.infer<typeof signInSchema>
