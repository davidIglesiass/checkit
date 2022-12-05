import express from 'express'
import Task from './models/Task'
import taskRoutes from './routes/task.router'
import authRoutes from './routes/auth.router'
import ExpressStatusMonitor from 'express-status-monitor'

const app = express()

app.set('port', 3000)

app.use(express.json())
app.use(ExpressStatusMonitor())

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


app.use('/api/auth', authRoutes)




export default app