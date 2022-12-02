import mongoose from "mongoose"
import DB_CONFIG from './config.json'

//Database connection
(async () => {
    try {
        const db = await mongoose.connect(DB_CONFIG.MONGODB_URI)
        console.log('Conectado a la base de datos: ', db.connection.name)
    } catch (error) {
        console.log('Estoy manejando el error');
        console.error(error);
    }
    
})()
