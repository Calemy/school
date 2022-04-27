const path = require('path');
const session = require("express-session");
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const store = new session.MemoryStore()
const bodyParser = require('body-parser')
app = express();
const panel = require('./helper/functions')

const { connect } = require('./helper/database');

// connect();

app.use(expressLayouts)
app.use(express.json())
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.use(session({
    secret: 'secret',
    cookie: { maxAge: 30000 },
    resave: false,
    saveUninitialized: false,
    store
}));

app.use(async (req, res, next) => {
    if(req.url.includes('/static/')) return next();
    res.locals.server = panel
    res.locals.login = false;
    res.locals.alert = req.session.lastAlert
    req.session.lastAlert = undefined;
    res.locals.session = req.session
    next();
})

app.use('/auth', require('./router/authRouter')) //Authentication
// app.use('/users', require('./router/userRouter')) //Users
// app.use('/actions', require('./router/actionRouter')) //Actions
// app.use('/settings', require('./router/settingsRouter')) //Settings
// app.use('/badges', require('./router/badgeRouter')) //Badges
// app.use('/errors', require('./router/errorRouter')) //Error Handler
app.use('*/static', express.static(__dirname + '/static')); //Assets
app.use('/', require('./router/mainRouter')); //Everything else

app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, '/templates'));

app.use(async (req, res) => { //404 Handler
    res.locals.login = false;
    return res.redirect('/')
})

app.listen(2446, () => {
    console.log('Server running on port 2446');
});