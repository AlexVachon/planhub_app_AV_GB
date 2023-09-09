const User = require('../models/Users')


const getAllUsers = async (req, res) => {
    const users = await User.find({})
    res.status(201).json({users})
}

const getOneUser = async (req, res) => {
    const user = await User.find({})
}



module.exports = {
    getAllUsers,
    getOneUser
}