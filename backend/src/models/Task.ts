import { Schema, model, type InferSchemaType } from 'mongoose'
import { TASK_STATUSES, TASK_PRIORITIES } from '../types.ts'

const taskSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: String,
    status: {
        type: String,
        enum: TASK_STATUSES,
        default: 'pending'
    },
    priority: {
        type: String,
        enum: TASK_PRIORITIES,
        default: 'medium'
    },
    dueDate: Date,
    tags: [String],
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true,
    versionKey: false
})

export type TaskDocument = InferSchemaType<typeof taskSchema>

export default model('Task', taskSchema)
