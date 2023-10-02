const Users = require('../models/Users')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')


const getOneUser = async (req, res) => {
    //Valeur des champs dans le formulaire **FAIRE EN POST**
    const { user_email, user_password } = req.body
    try {
        const user = await Users.findOne({ 'email': user_email })
        if (user == null) {
            res.status(400).json({message: 'Courriel incorrect' })
        }

        const passwordMatch = await bcrypt.compare(user_password, user.password);

        if (passwordMatch) {
            res.status(201).json({ message: `Connecté en tant que ${user.username}`, user })
        } else {
            res.status(400).json({ message: "Mot de passe incorrect"})
        }

    } catch (err) {
        console.error("Erreur de la recherche de l'utilisateur :", err)
    }

}

const getAllUsers = async (req, res) => {
    try {
        const users = await Users.find({})

        res.status(201).json({ users })

    } catch (err) {
        console.error("Erreur de la recherche des utilisateurs :", err)
    }
}

const createUser = async (req, res) => {
    const { first_name, last_name, username, email, password, password_confirm } = req.body
    if (password == password_confirm) {
        try {
            const user = new Users({
                _id: new mongoose.Types.ObjectId(),
                first_name: first_name.toString(),
                last_name: last_name.toString(),
                username: username.toString(),
                email: email.toString(),
                password: password.toString()
                
            })
            console.log(user)
            user.save()
            res.status(201).redirect('/join')
        } catch (err) {
            console.error("Erreur de la création de l'utilisateur :", err)
        }
    } else {
        res.status(400).json({ message: "Les mots de passe ne sont pas identiques." })
    }
}


module.exports = {
    getOneUser,
    getAllUsers,
    createUser
}