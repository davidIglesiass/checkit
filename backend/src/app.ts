import express from 'express'
import cors from 'cors'
import taskRoutes from './routes/task.router.ts'
import authRoutes from './routes/auth.router.ts'
import config from './config.ts'

const app = express()

app.set('port', config.port)

app.use(cors({ origin: config.corsOrigin }))
app.use(express.json())

app.get('/', (_req, res) => {
    res.json({
        message: "checkit API is running"
    })
});

app.use('/api/tasks', taskRoutes)
app.use('/api/auth', authRoutes)

export default app