const Users = require('../models/Users')


const getOneUser = async (req, res) => {
    //Valeur des champs dans le formulaire **FAIRE EN POST**
    const {user_email, user_password} = req.body
    try{
        const user = await Users.findOne({'email': user_email, 'password': user_password})
        if (user){
            res.status(201).json({user})
        }else{
            res.status(404).json({message: "Utilisateur non trouvé"})
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


module.exports = {
    getOneUser,
    getAllUsers
}