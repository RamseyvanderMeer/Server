const express = require('express');
const path = require('path');
const Joi = require('joi');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const db = require('./queries');

app.use('/public',express.static(path.join(__dirname,'static')));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json()); 

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'static','index.html'));
})

app.get('/users', db.getUsers)

app.listen(3000, () => {
    console.log(`App running on port ${port}.`)
  })

app.post('/',(req,res)=>{
    const schema = Joi.object().keys({
        email : Joi.string().trim().email().required(), 
        password : Joi.string().min(5).max(10).required()
    });
    Joi.validate(req.body,schema,(err,result)=>{
        if(err){
            console.log(err);
            res.send(err);
        }
        console.log(result);
        res.send('posted data');
    });
});