const Users = require('../models/Users')
const bcrypt = require('bcrypt');


const getOneUser = async (req, res) => {
    //Valeur des champs dans le formulaire **FAIRE EN POST**
    const {user_email, user_password} = req.body
    try{
        const user = await Users.findOne({'email': user_email})
        const passwordMatch = await bcrypt.compare(user_password, user.password);

        if (passwordMatch) {
            // Le mot de passe correspond, vous pouvez répondre avec les détails de l'utilisateur
            res.status(201).json({ user });
        } else {
            // Le mot de passe ne correspond pas
            res.status(401).json({ message: "Mot de passe incorrect" });
        }

    }catch(err){
        console.error("Erreur de la recherche de l'utilisateur :", err)
    }
    
}

const getAllUsers = async (req, res) => {
    try{
        const users = await Users.find({})
        
        res.status(201).json({users})
        
    }catch(err){
        console.error("Erreur de la recherche des utilisateurs :", err)
    }
}

const createUser = async (req, res) => {
    const {first_name, last_name, username, email, password, password_confirm} = req.body
    if (password == password_confirm){
        try{
            const user = await Users.create({"first_name": first_name, "last_name": last_name, "username": username, "email": email, "password": password})
            res.status(201).json({user})
        }catch(err){
            console.error("Erreur de la création de l'utilisateur :", err)
        }
    }else{
        res.status(400).json({message: "Les mots de passe ne sont pas identiques."})
    }
}


module.exports = {
    getOneUser,
    getAllUsers,
    createUser
}