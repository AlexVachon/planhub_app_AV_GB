const Users = require('../models/Users')

const express = require('express')
const app = express()

const path = require('path')


app.set('view engine', 'ejs');

const loadPage = (req, res) => {
    if (!req.session.user)
        res.status(201).render(path.join(__dirname, '../public/templates/login'))
    else
        res.status(401).redirect('/')
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
    loadCreate,
    confirmEmail,
    isEmailUsed,
    isUserNameUsed
}