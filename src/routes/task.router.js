import { Router } from 'express';
import Task from '../models/Task';
import * as taskCntl from '../controllers/taskController'

const router = Router()

router.post('/', taskCntl.newTask)

router.get('/', taskCntl.findAllTask)

router.get('/:id', taskCntl.findOneTask)

router.put('/:id', taskCntl.updateTask)

router.delete('/:id', taskCntl.deleteTask)



export default router