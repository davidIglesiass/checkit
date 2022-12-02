import express from 'express'
import Task from './models/Task'
import taskRoutes from './routes/task.router'

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


app.use('/api/tasks', taskRoutes)




export default app