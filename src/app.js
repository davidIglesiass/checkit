import express from 'express'
import Task from './models/Task'

const app = express()

app.set('port', 3000)

app.use(express.json())

app.get('/', (req, res) => {
    res.json({
        message: "Welcome to my backend"
    })
});

app.post('/', (req, res) => {
    res.json({
        message: "You can't use require here"
    })
});

app.post('/api', async (req, res)=>{
    const newTask = new Task({
        title: req.body.title,
        description: req.body.description
    })
    await newTask.save()
    console.log(newTask)
    res.json({ message: 'tarea guardada' })

})

export default app