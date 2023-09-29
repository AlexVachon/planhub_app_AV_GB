require('dotenv').config()
const Users = require('../models/Users')

const express = require('express')
const app = express()

const axios = require('axios')
const path = require('path')

const port = process.env.PORT || 3000

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
    try {
        const { confirm_email } = req.body

        const user = await Users.findOne({ 'email': confirm_email })
        if (user == null) {
            res.status(400).json(false)
        }
        else {
            res.status(200).json(true)
        }
    } catch (error) {

    }
}

const setSession = (req, res) => {
    const { connect_email, connect_password } = req.body;

    const userData = {
        user_email: connect_email,
        user_password: connect_password
    }

    axios.post(`http://localhost:${port}/api/v1/users/connect`, userData)
        .then(({ data }) => {
            console.log(data)
            req.session.authenticated = true
            console.log(data['user']['_id'])
            req.session.user = data['user']['_id']
            res.redirect('/')
        })
        .catch(error => {
            console.error("Erreur inattendue :", error)
            res.status(500).json({ message: 'Erreur serveur' })
        })
}

const isEmailUsed = async (req, res) => {
    const { email } = req.body
    try{
        const user = await Users.findOne({'email': email})

        if (user){
            res.status(200).json(true)
        }else{
            res.status(200).json(false)
        }
        
    }catch(e){
        console.log(e)
    }
}

const isUserNameUsed = async (req, res) => {
    const { username } = req.body

    try {
        
        const user = await Users.findOne({'username': username})

        if(user){
            res.status(200).json(true)
        }else{
            res.status(200).json(false)
        }

    } catch (e) {
        console.log(e)
    }
}

module.exports = {
    loadPage,
    setSession,
    loadCreate,
    confirmEmail,
    isEmailUsed,
    isUserNameUsed
}