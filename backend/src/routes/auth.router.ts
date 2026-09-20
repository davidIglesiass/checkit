import { Router } from 'express'
import * as ctrlUser from '../controllers/authController.ts'
import { validate } from '../middlewares/validate.ts'
import { signUpSchema, signInSchema } from '../validators/authSchemas.ts'

const router = Router()

router.post('/signup', validate(signUpSchema), ctrlUser.signUp)
router.post('/signin', validate(signInSchema), ctrlUser.signIn)

export default router
