const express = require('express');
const path = require('path');
const Joi = require('joi');
const bodyParser = require('body-parser');
const app = express();

app.use('/public',express.static(path.join(__dirname,'static')));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json()); 

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'static','index.html'));
}).listen(3000);

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