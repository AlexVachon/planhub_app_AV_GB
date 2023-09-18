require('dotenv').config()

const express = require('express')
const app = express()

const axios = require('axios')
const path = require('path')

const port =  process.env.PORT || 3000

app.set('view engine', 'ejs');

const loadPage = (req, res) => {
    res.render(path.join(__dirname, '../public/templates/join'))
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
            res.status(500).json({ message: 'Erreur lors de la connexion au compte.' })
        });
    
}

module.exports = {
    loadPage,
    setSession,
}