import 'dotenv/config'

const required = (name: string): string => {
    const value = process.env[name]
    if (!value) throw new Error(`Falta la variable de entorno ${name}`)
    return value
}

export default {
    port: process.env.PORT || 3000,
    mongodbUri: required('MONGODB_URI'),
    jwtSecret: required('JWT_SECRET'),
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173'
}
