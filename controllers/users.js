const Users = require('../models/Users')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')

const regexFNLN = /^.{3,50}$/
const regexUN = /^[a-zA-Z0-9_]{8,20}$/
const regexEM = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const regexPW = /^.{8,}/

const getOneUser = async (req, res) => {
    const { user_email, user_password } = req.body
    try {
        const user = await Users.findOne({ 'email': user_email })
        if (user == null) {
            res.status(400).json({ message: 'Courriel incorrect' })
        }

        const passwordMatch = await bcrypt.compare(user_password, user.password);

        if (passwordMatch) {
            req.session.authenticated = true
            console.log(user._id)
            req.session.user = user._id
            res.status(201).redirect('/')
        } else {
            res.status(400).json({ message: "Mot de passe incorrect" })
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
    if (regexFNLN.test(first_name) && regexFNLN.test(last_name) &&
        regexUN.test(username) && regexEM.test(email) && regexPW.test(password) && password == password_confirm) {
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
            user.save().then(() => {
                res.status(201).redirect('/join')
            }).catch((err) => {
                if (err.name === 'ValidationError') {
                    const validationErrors = {};
                    for (const key in err.errors) {
                        validationErrors[key] = err.errors[key].message;
                    }
                    console.error(validationErrors);
                    res.status(400).json({ errors: validationErrors });
                } else {
                    console.error(err);
                    res.status(500).json({ message: 'Une erreur interne est survenue.' });
                }
            })

        } catch (err) {
            console.error(err)
        }
    } else {
        res.status(400).json({ message: "Au moins un des champs est incorrects..." })
    }
}


module.exports = {
    getOneUser,
    getAllUsers,
    createUser
}