const { Router } = require('express')
const { request } = require('../helper/database')
const md5 = require('md5')
const bcrypt = require('bcrypt')
const { alert } = require('../helper/functions')

const router = new Router()

router.post('/login', async function (req, res){
    const { username, password } = req.body;
    if(req.session.authenticated) return res.redirect('/')

    const userCheck = await request(`SELECT * FROM users WHERE username_safe = '${username.toLowerCase().replaceAll(" ", "_")}'`)
    if(userCheck.length == 0) return alert(req, res, 'danger', 'Sie sind schon eingeloggt.', '/')

    const user = userCheck[0]

    if(!await bcrypt.compare(md5(password), user.password_md5)) return alert(req, res, 'danger', 'Das Passwort stimmt nicht überein.', '/login')

    req.session.authenticated = true
    req.session.user = user
    res.redirect('/')

})

router.get('/logout', async function (req, res) {
    req.session.authenticated = false;
    req.session.user = undefined;
    alert(req, res, 'success', 'Erfolgreich ausgeloggt.', '/login')
})

router.post('/register', async function (req, res) {
    const { name, username, password, key } = req.body;

    const findKey = await request(`SELECT * FROM keys WHERE key = '${key}'`)
    if(findKey.length < 1) return alert(req, res, 'danger', 'Dieser Schlüssel existiert nicht', '/register')

    const findUser = await request(`SELECT * FROM users WHERE username_safe = '${username.toLowerCase().replaceAll(" ", "_")}'`)
    if(findUser.length > 0) return alert(req, res, 'danger', 'Dieser Username wird schon verwendet', '/register')

    const hash = await bcrypt.hash(md5(password), 10)

    await request(`INSERT INTO users (name, username, username_safe, password_md5) VALUES ('${name}', '${username}', '${username.toLowerCase().replaceAll(" ", "_")}', '${hash}')`)

    return alert(req, res, 'success', 'Sie haben sich erfolgreich registriert!', '/login')
})

module.exports = router