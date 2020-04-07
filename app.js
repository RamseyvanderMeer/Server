const express = require('express');
const path = require('path');
const Joi = require('joi');
const bodyParser = require('body-parser');
const db = require('./queries');
const dotenv = require('dotenv');
const pg = require('pg');
const bcrypt = require('bcrypt')
const app = express();

dotenv.config();

var conString = process.env.db_URL;
var client = new pg.Client(conString);

app.use(bodyParser.json());
app.use(express.json());

app.set('view-engine', 'ejs');
app.use(express.urlencoded({ extended: false }));

app.use('/public',express.static(path.join(__dirname,'static')));
app.use(bodyParser.urlencoded({extended: false})); 

dotenv.config();

app.listen(process.env.PORT, ()=> console.log(`web server is running on port: ${process.env.PORT}`));

var conString = process.env.db_URL;
var client = new pg.Client(conString);

app.get('/',(req,res)=>{
    res.render('index.ejs');
});

app.get('/register',(req,res)=>{
    res.render('register.ejs');
});

app.post('/', async (req,res)=>{
    const schema = Joi.object().keys({
        email : Joi.string().trim().email().required(), 
        password : Joi.string().min(5).max(10).required()
    });
    Joi.validate(req.body,schema, async (err,result)=>{
        try{
            await db.connect();
            var user = req.body;
            var userEmail = user.email;
            var userPassword = user.password;
            var users = await db.getUsers();
            users.forEach(t=>{
                if (t.email === userEmail){
                    console.log(`${t.email} is the same as ${userEmail}`);
                    if (t.admin == true){ //admin
                        if (t.password === userPassword){
                            console.log(t.name);
                            res.render('admin.ejs', { name: t.name});
                        }
                    }
                    else if (t.admin == false){ //user
                        if (t.password === userPassword){
                            res.render('user.ejs');
                        }
                    }
                    else{
                        res.send('no role specified');
                    }
                }
            });
            
        }
        catch (e){
            console.log(e);
        } 
    });  
});

app.get('/guest', (req,res)=>{
    res.sendFile(path.join(__dirname,'static','guest.html'));
});
  
app.post('/register', async (req, res)=>{
    // console.log(req.body.name + req.body.email + req.body.password);
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;
    console.log(name + email + password);
    try{
        await db.connect();
        await db.createUser(name, email, password);
        res.render('index.ejs');
    }
    catch (e){
        console.log(e);
    }
});