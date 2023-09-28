require('dotenv').config()
const Users = require('../models/Users')

const express = require('express')
const app = express()

const axios = require('axios')
const path = require('path')

const port =  process.env.PORT || 3000

app.set('view engine', 'ejs');

const loadPage = (req, res) => {
    if (!req.session.user)
        res.status(201).render(path.join(__dirname, '../public/templates/login'))
    else
        res.status(201).redirect('/')
}

const loadCreate = (req, res) => {
    if (req.session.user)
        res.status(201).redirect('/')
    else
        res.status(201).render(path.join(__dirname, '../public/templates/signin'))
}

const confirmEmail = async (req, res) => {
    try{
        const {confirm_email} = req.body

        const user = await Users.findOne({ 'email': confirm_email})
        if (user == null) {
            res.status(400).json(false)
        }
        else{
            res.status(200).json(true)
        }
    }catch(error){

    }
}

const setSession = (req, res) => {
    const { connect_email, connect_password } = req.body;

    const userData = {
        user_email: connect_email,
        user_password: connect_password
    }
    
    axios.post(`http://planhub.click/api/v1/users/connect`, userData)
        .then(({data}) => {
            console.log(data)
            req.session.authenticated = true
            req.session.user = data['user']
            res.redirect('/')
        })
        .catch(error => {
            console.error("Erreur inattendue :", error)
            res.status(500).json({ message: 'Erreur serveur' })
        })
}

const createUser = (req, res) => {
    const {sign_first_name, sign_last_name, sign_username, sign_email, sign_password, sign_password_confirm} = req.body

    const userData = {
        first_name: sign_first_name,
        last_name: sign_last_name,
        username: sign_username,
        email: sign_email,
        password: sign_password,
        password_confirm: sign_password_confirm
    }
    
    axios.post(`http://planhub.click/api/users/create`, userData)
    .then(({data}) => {
        console.log(data)
        console.log(data['message'])
    })
    .catch(error => {
        console.log(error)
        res.status(500).json({ message: 'Erreur lors de la création du compte.' })
    })
}

module.exports = {
    loadPage,
    setSession,
    createUser,
    loadCreate,
    confirmEmail,
}