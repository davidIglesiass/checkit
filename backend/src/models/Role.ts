import { Schema, model, type InferSchemaType } from 'mongoose'
import { ROLE_NAMES } from '../types.ts'

const roleSchema = new Schema({
    name: {
        type: String,
        enum: ROLE_NAMES,
        required: true,
        unique: true
    }
}, {
    versionKey: false
})

export type RoleDocument = InferSchemaType<typeof roleSchema>

export default model('Role', roleSchema)
