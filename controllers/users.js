const Users = require('../models/Users')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')

const getUserById = async (req, res) => {
    const userId = req.params.userId;

    try {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid userId' });
        }

        const user = await Users.findOne({ _id: userId });
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur introuvable' });
        }

        res.status(200).json({ user });
    } catch (err) {
        console.error("Erreur de la recherche de l'utilisateur :", err);
        res.status(500).json({ message: 'Une erreur interne est survenue.' });
    }
};


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
        res.status(400).json({ message: "Les mots de passe ne sont pas identiques" })
    }
}


module.exports = {
    getUserById,
    getOneUser,
    getAllUsers,
    createUser
}