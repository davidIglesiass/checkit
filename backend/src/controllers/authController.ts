import type { Request, Response } from 'express'
import type { Types } from 'mongoose'
import User from '../models/User.ts'
import Role from '../models/Role.ts'
import jwt from 'jsonwebtoken'
import CONFIG from '../config.ts'
import { encryptPassword, comparePassword } from '../utils/password.ts'
import { isDuplicateKeyError } from '../utils/errors.ts'
import type { SignUpInput, SignInInput } from '../validators/authSchemas.ts'

const signToken = (userId: Types.ObjectId) =>
    jwt.sign({ id: userId.toString() }, CONFIG.jwtSecret, { expiresIn: 86400 })

export const signUp = async (req: Request<{}, {}, SignUpInput>, res: Response) => {
    try {
        const { username, email, password, roles } = req.body

        const requestedRoles = roles?.length ? roles : ['user']
        const foundRoles = await Role.find({ name: { $in: requestedRoles } })

        const newUser = new User({
            username,
            email,
            password: await encryptPassword(password),
            roles: foundRoles.map((role) => role._id)
        })

        const savedUser = await newUser.save()

        res.status(201).json({
            message: 'Usuario registrado con exito',
            token: signToken(savedUser._id)
        })
    } catch (error) {
        if (isDuplicateKeyError(error)) {
            return res.status(409).json({ message: 'El usuario o email ya esta registrado' })
        }
        res.status(500).json({ message: 'Ocurrio un error inesperado registrando al usuario' })
    }
}

export const signIn = async (req: Request<{}, {}, SignInInput>, res: Response) => {
    try {
        const { email, password } = req.body

        const userFound = await User.findOne({ email })
        if (!userFound) return res.status(404).json({ message: 'Usuario no registrado' })

        const matchPassword = await comparePassword(password, userFound.password)
        if (!matchPassword) return res.status(401).json({ message: 'Contraseña invalida' })

        res.status(200).json({
            message: 'Inicio de sesion exitoso',
            token: signToken(userFound._id)
        })
    } catch (error) {
        res.status(500).json({ message: 'Error en el inicio de sesion, intente de nuevo' })
    }
}
