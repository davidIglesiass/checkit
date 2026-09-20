import Role from './models/Role.ts'

const ROLE_NAMES = ['user', 'admin']

export default async function seedRoles() {
    for (const name of ROLE_NAMES) {
        await Role.updateOne({ name }, { $setOnInsert: { name } }, { upsert: true })
    }
}
