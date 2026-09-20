import mongoose from 'mongoose'
import config from './config.ts'
import seedRoles from './seedRoles.ts'

(async () => {
    try {
        const db = await mongoose.connect(config.mongodbUri)
        console.log('Conectado a la base de datos:', db.connection.name)
        await seedRoles()
    } catch (error) {
        console.error('Error conectando a la base de datos:', error)
    }
})()
