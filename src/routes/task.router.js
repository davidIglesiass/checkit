import { Router } from 'express';
import { verifyToken } from '../middlewares/authJwt';
import * as taskCntl from '../controllers/taskController'

const router = Router()

router.post('/', verifyToken, taskCntl.newTask)

router.get('/', taskCntl.findAllTask)

router.get('/search', taskCntl.findByName)

router.get('/:id', taskCntl.findOneTask)

router.put('/:id', verifyToken, taskCntl.updateTask)

router.delete('/:id', verifyToken, taskCntl.deleteTask)



export default router