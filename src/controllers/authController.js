import User from '../models/User'

export const signUp = async (req, res) => {
    const { username, email, password, roles } = req.body

    const newUser = new User({
        username, //Exactamente lo mismo que username: username.
        email,
        password: await User.encryptPassword(password)
    })

    const savedUser = await newUser.save()

    console.log(savedUser)

    res.json({
        message: "Usuario registrado con exito"
    })
}

export const signIn = async (req, res) => {
    const userFound = await User.findOne({ email: req.body.email })
}
