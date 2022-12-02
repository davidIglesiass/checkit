import Task from '../models/Task'

export const newTask = async (req, res) => {
    
    if (!req.body.title) {
        res.status(400).send(
            {
                message: "El campo titulo no puede ir vacio"
            }
        )
    }
    if (!req.body.description) {
        res.status(400).send(
            {
                message: "El campo descripcion no puede ir vacio"
            }
        )
    }


    try {
        
        const newTask = new Task({
            title: req.body.title,
            description: req.body.description
        })
        await newTask.save()
        console.log(newTask)
        res.json({ message: 'tarea guardada!' })

    }catch (error) {
        
        res.status(500).json(
            {   
                //message: error.message || "..."
                message: "Algo fallo al intentar guardar tu tarea, por favor verfica los campos"
            }
        )
    }

}

export const findAllTask = async (req, res) => {
    const tareas = await Task.find()
    res.json(tareas)
}

export const findOneTask = async (req, res) => {

    const id = req.params.id
    const tarea = await Task.findById(id)
    res.json(tarea)
}

export const updateTask = async (req, res) => {

    const {id} = req.params // {id} or id is the same thing

    await Task.findByIdAndUpdate(id, req.body)

    res.json(
        {
            message: `La tarea con el: ${id}, ha sido actualizada`
        }
    )
}

export const deleteTask = async (req, res) => {

    const id = req.params.id
    await Task.findByIdAndDelete(id)
    res.json(
        {
            message:`La tarea con el id: ${id}, ha sido eliminada satisfactoriamente`
        }
    )
}