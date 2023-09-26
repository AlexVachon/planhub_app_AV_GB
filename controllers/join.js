require('dotenv').config()

const express = require('express')
const app = express()

const axios = require('axios')
const path = require('path')

const port =  process.env.PORT || 3000

app.set('view engine', 'ejs');

const loadPage = (req, res) => {
    if (!req.session.user)
        res.status(201).render(path.join(__dirname, '../public/templates/login'), {message:null})
    else
        res.status(201).redirect('/')
}

const loadCreate = (req, res) => {
    if (req.session.user)
        res.status(201).redirect('/')
    else
        res.status(201).render(path.join(__dirname, '../public/templates/signin'))
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
            res.status(201).redirect('/')
        })
        .catch(error => {
            console.log(error)
            res.status(500).render(path.join(__dirname, '../public/templates/join'), { message: error['response']['data']['message'], success: false })
        });
    
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
}