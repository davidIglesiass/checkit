import User from '../models/User'
import jwt from 'jsonwebtoken'
import CONFIG from '../config.json'

export const signUp = async (req, res) => {
    try {
        const { username, email, password, roles } = req.body

        const newUser = new User({
            username, //Exactamente lo mismo que username: username.
            email,
            password: await User.encryptPassword(password)
        })

        const savedUser = await newUser.save()

        const token = jwt.sign(
            {
                id: savedUser._id
            },
            CONFIG.SECRET,
            {
                expiresIn: 86400
            }
        )

        console.log(savedUser)

        res.json({
            message: "Usuario registrado con exito", token
        })
    } catch (error) {
        res.status(500).json({ message: "Ocurrio un error inesperado registrando al usuario" })   
    }
}

export const signIn = async (req, res) => {

    try {
        //Verifica que el campo password este diligenciado
        if(!req.body.password) return res.status(400).json({ message:"Campo password obligatorio" })
        //Verifica la existencia del usuario por medio del email
        const userFound = await User.findOne({ email: req.body.email })
        if (!userFound) return res.status(404).json({ message: "Usuario no registrado" })
        //Verificacion de la contraseña
        const matchPassword = await User.comparePassword(req.body.password, userFound.password)
        if (!matchPassword) return res.status(401).json({ message: "Contraseña invalida" })

        //Recepcion del token
        const token = jwt.sign(
            {
                id: userFound._id
            },
            CONFIG.SECRET,
            {
                expiresIn: 86400
            }
        )

        //Al pasar los filtros previos, retorna en una inicio de sesion exitoso
        res.status(200).json(
            {
                message: "Inicio de sesion exitoso",
                token
            }
        )

    } catch (error) {
        //Al hacer 'catch' en un error el cual no se haya prevenido en el 'try' retorna un error en el inicio de sesion.
        res.status(200).json({ message: "Error en el inicio de sesion, intente de nuevo" })
    }
}
