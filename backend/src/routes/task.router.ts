import { Router } from 'express'
import { verifyToken } from '../middlewares/authJwt.ts'
import { validate } from '../middlewares/validate.ts'
import { createTaskSchema, updateTaskSchema } from '../validators/taskSchemas.ts'
import * as taskCntl from '../controllers/taskController.ts'

const router = Router()

router.use(verifyToken)

router.post('/', validate(createTaskSchema), taskCntl.newTask)
router.get('/', taskCntl.findAllTask)
router.get('/search', taskCntl.findByName)
router.get('/:id', taskCntl.findOneTask)
router.put('/:id', validate(updateTaskSchema), taskCntl.updateTask)
router.delete('/:id', taskCntl.deleteTask)

export default router
