const express = require('express');
const path = require('path');
const Joi = require('joi');
const bodyParser = require('body-parser');
const db = require('./queries');
const dotenv = require('dotenv');
const pg = require('pg');
const app = express();
const bcrypt = require('bcrypt');
const saltRounds = 10;

app.use(bodyParser.json());
app.use(express.json());

app.use('/public',express.static(path.join(__dirname,'static')));
app.use(bodyParser.urlencoded({extended: false})); 

dotenv.config();

app.listen(process.env.PORT, ()=> console.log(`web server is running on port: ${process.env.PORT}`));

var conString = process.env.db_URL;
var client = new pg.Client(conString);

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'static','index.html'));
})

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
            var emails = await db.getUsers();
            emails.forEach(t=>{
                //console.log(t);
                if (t.email === userEmail){
                    console.log(`${t.email} is the same as ${userEmail}`);
                    console.log(t.type);
                    if (t.type == 'admin'){ //admin
                        if (t.password === userPassword){
                            res.sendFile(path.join(__dirname,'static','admin.html'));
                            console.log(t.type);
                        }
                    }
                    else if (t.type == 'user'){ //user
                        if (t.password === userPassword){
                            res.sendFile(path.join(__dirname,'static','user.html'));
                            console.log(t.type);
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

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'static','index.html'));
  })
  
app.get('/register', async (req, res)=>{
    res.sendFile(path.join(__dirname,'static','register.html'));
});


//work in progress
app.post('/register', (req,res)=>{
    const schema = Joi.object().keys({
        email : Joi.string().trim().email().required(), 
        password : Joi.string().min(5).max(10).required()
    });
    Joi.validate(req.body,schema, async (err,result)=>{
        try{
            await client.connect();
            const user = req.body;
            const email = user.email;
            const password = user.password;
            const type = user.type;
            console.log(type + email + password);
            await client.query('INSERT INTO users (email, password, type) VALUES (?,?,?)', [email, password, type], (err, results) => {
                if(err) throw err;
            });
            res.sendFile(path.join(__dirname,'static','index.html'));
        }
        catch (e){
            console.log(e);
        } 
    });  
});