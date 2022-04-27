const { Router } = require('express')
const { request } = require('../helper/database')

const router = new Router()

router.get('/', async (req, res) => {
    res.render('home')
})

router.get('/login', async (req, res) => {
    res.locals.title = 'Login'
    res.locals.login = true;
    res.render('login')
})

router.get('/register', async (req, res) => {
    res.locals.title = 'Registrieren'
    res.locals.login = true;
    res.render('register')
})

module.exports = router