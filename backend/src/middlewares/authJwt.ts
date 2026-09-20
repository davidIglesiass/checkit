import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import CONFIG from '../config.ts'
import User from '../models/User.ts'
import type { RoleDocument } from '../models/Role.ts'

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers['x-access-token']

        if (!token || typeof token !== 'string') {
            return res.status(403).json({ message: 'No se proporciono token de acceso' })
        }

        const decoded = jwt.verify(token, CONFIG.jwtSecret)
        if (typeof decoded === 'string' || !decoded.id) {
            return res.status(401).json({ message: 'Acceso no autorizado' })
        }

        const user = await User.findById(decoded.id, { password: 0 })

        if (!user) return res.status(404).json({ message: 'No se encontro el usuario' })

        req.userId = user._id.toString()
        next()
    } catch (error) {
        return res.status(401).json({ message: 'Acceso no autorizado' })
    }
}

export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.findById(req.userId).populate<{ roles: RoleDocument[] }>('roles')

        const hasAdminRole = (user?.roles ?? []).some((role) => role.name === 'admin')

        if (!hasAdminRole) return res.status(403).json({ message: 'Requiere rol de administrador' })

        next()
    } catch (error) {
        return res.status(500).json({ message: 'Error verificando permisos' })
    }
}
