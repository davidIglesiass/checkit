import type { Request, Response } from 'express'
import Task from '../models/Task.ts'
import type { CreateTaskInput, UpdateTaskInput } from '../validators/taskSchemas.ts'
import type { TaskStatus, TaskPriority } from '../types.ts'

type TaskParams = { id: string }

type TaskQuery = {
    status?: TaskStatus
    priority?: TaskPriority
    page?: string
    limit?: string
    sort?: string
}

export const newTask = async (req: Request<{}, {}, CreateTaskInput>, res: Response) => {
    try {
        const task = new Task({ ...req.body, owner: req.userId })
        await task.save()
        res.status(201).json(task)
    } catch (error) {
        res.status(500).json({ message: 'Algo fallo al intentar guardar tu tarea' })
    }
}

export const findAllTask = async (req: Request<{}, {}, {}, TaskQuery>, res: Response) => {
    try {
        const { status, priority, page = '1', limit = '10', sort = '-createdAt' } = req.query

        const filter: { owner?: string; status?: TaskStatus; priority?: TaskPriority } = { owner: req.userId }
        if (status) filter.status = status
        if (priority) filter.priority = priority

        const pageNum = Math.max(1, Number(page))
        const limitNum = Math.min(100, Math.max(1, Number(limit)))

        const [tasks, total] = await Promise.all([
            Task.find(filter)
                .sort(sort)
                .skip((pageNum - 1) * limitNum)
                .limit(limitNum),
            Task.countDocuments(filter)
        ])

        res.json({
            data: tasks,
            page: pageNum,
            limit: limitNum,
            total,
            totalPages: Math.ceil(total / limitNum)
        })
    } catch (error) {
        res.status(500).json({ message: "Upps, something's wrong" })
    }
}

export const findOneTask = async (req: Request<TaskParams>, res: Response) => {
    const { id } = req.params

    try {
        const task = await Task.findOne({ _id: id, owner: req.userId })

        if (!task) return res.status(404).json({ message: `La tarea con id: ${id}, no existe` })

        res.json(task)
    } catch (error) {
        res.status(500).json({ message: `Error al buscar la tarea con el id: ${id}` })
    }
}

export const updateTask = async (req: Request<TaskParams, {}, UpdateTaskInput>, res: Response) => {
    const { id } = req.params

    try {
        const task = await Task.findOneAndUpdate({ _id: id, owner: req.userId }, req.body, { new: true })

        if (!task) return res.status(404).json({ message: `La tarea con id: ${id}, no existe` })

        res.json(task)
    } catch (error) {
        res.status(500).json({ message: `Ha habido un error al momento de actualizar la tarea con el id: ${id}` })
    }
}

export const deleteTask = async (req: Request<TaskParams>, res: Response) => {
    const { id } = req.params

    try {
        const task = await Task.findOneAndDelete({ _id: id, owner: req.userId })

        if (!task) return res.status(404).json({ message: `La tarea con id: ${id}, no existe` })

        res.json({ message: `La tarea con el id: ${id}, ha sido eliminada satisfactoriamente` })
    } catch (error) {
        res.status(500).json({ message: `Error al eliminar la tarea con el id: ${id}` })
    }
}

export const findByName = async (req: Request<{}, {}, {}, { title?: string }>, res: Response) => {
    const { title } = req.query

    if (!title) return res.status(400).json({ message: 'Parametro title obligatorio' })

    try {
        const tasks = await Task.find({ owner: req.userId, title: { $regex: title, $options: 'i' } })
        res.json(tasks)
    } catch (error) {
        res.status(500).json({ message: 'Opps, algo fallo al encontrar tu tarea' })
    }
}
