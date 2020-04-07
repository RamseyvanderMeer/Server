const express = require('express');
const path = require('path');
const Joi = require('joi');
const bodyParser = require('body-parser');
const db = require('./queries');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt')
const passport = require('passport');
const methodOverride = require('method-override');
const flash = require('express-flash');
const session = require('express-session');
const app = express();

dotenv.config();

var users = [];
(async () => {
    await db.connect();
    users = await db.getUsers();
})();

const initpassport = require('./passport-config');
initpassport(
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
);

app.use(flash());
app.use(session({ 
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use(express.json());
app.use(methodOverride('_method'));

app.set('view-engine', 'ejs');
app.use(express.urlencoded({ extended: false }));

app.listen(process.env.PORT, ()=> console.log(`web server is running on port: ${process.env.PORT}`));

app.get('/', checkAuthenticated, (req,res)=>{
    res.render('index.ejs');
});

app.get('/register', checkAuthenticated, (req,res)=>{
    res.render('register.ejs');
});

app.get('/guest', checkAuthenticated, (req,res)=>{
    res.render('guest.ejs');
});

app.get('/user', checkNotAuthenticated, (req, res)=>{
    res.render('user.ejs', { name: req.user.name });
});

app.post('/', checkAuthenticated, passport.authenticate('local', {
    successRedirect: '/user',
    failureRedirect: '/',
    failureFlash: true
}));
  
app.post('/register', checkAuthenticated, (req, res)=>{
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;
    const schema = Joi.object().keys({
        email : Joi.string().trim().email().required(), 
        password : Joi.string().min(5).max(15).required()
    });
    Joi.validate(req.body, schema, async (err,result)=>{
        const hashed = await bcrypt.hash(password, 10);
        try{
            await db.connect();
            await db.createUser(name, email, hashed);
            console.log(`created user ${name} with email ${email} and password ${password} with hash ${hashed}`);
            res.redirect('/');
        }
        catch (e){
            res.redirect('/register');
        }
    });
});

app.delete('/logout', (req, res)=>{
    req.logOut();
    res.redirect('/');
});

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/user');
}
  
function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect('/');
    }
    next();
}
  