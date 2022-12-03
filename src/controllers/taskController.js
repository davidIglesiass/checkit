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

    try {
        const tareas = await Task.find()
        res.json(tareas)
    } catch (error) {
        
        res.status(500).json(
            {
                        //error.message 
                message: "Upps, something's wrong"
            }
        )
    }

}

export const findOneTask = async (req, res) => {
    
    const id = req.params.id

    try {

        const id = req.params.id
        const tarea = await Task.findById(id)

        if (!tarea) return res.status(404).json({ message: `La tarea con id: ${id}, no existe` })

        res.json(tarea)
        
    } catch (error) {

        res.status(500).json(
            {
                message: error.message || `Error al buscar la tarea con el id: ${id} ` 
            }
        )
    }
}

export const updateTask = async (req, res) => {

    const { id } = req.params // {id} or id is the same thing
    
    if(!req.body.title) {return res.status(400).send({ message:"el campo titulo esta VACIO!"})}
    if(!req.body.description) {return res.status(400).send({ message:"el campo descripcion esta VACIO!"})}

    try {    
        await Task.findByIdAndUpdate(id, req.body)
        res.json(
            {
                message: `La tarea con el: ${id}, ha sido actualizada`
            }
        )
    } catch (error) {
        res.status(500).json(
            {
                message:`Ha habido un error al momento de actualizar la tarea con el id: ${id}`
            }
        )
    }
}

export const deleteTask = async (req, res) => {

    const id = req.params.id
  
    try {
        const id = req.params.id
        await Task.findByIdAndDelete(id)
        res.json(
            {
                message:`La tarea con el id: ${id}, ha sido eliminada satisfactoriamente`
            }
        )
    } catch (error) {
        res.status(500).json(
            {
                message: error.message || `Error al buscar la tarea con el id: ${id} `
            }
        )   
        
    }


}

//Busqueda flexible por nombre (titulo de tarea)
export const findByName = async (req, res) => {

    if(!req.body.title) return res.status(400).json({ message: "Campo title obligatorio" })
    const title = req.body.title
    try {
        const tareas = await Task.find({ title: { $regex: title, $options: 'i' } })
        if (tareas.length === 0) return res.status(404).json({ message: "No se encontro coincidencia alguna" })
        res.json(tareas)
    } catch (error) {
        res.status(500).json({
            message: "Opps, algo fallo al encontrar tu tarea"
        })
    }
}