const express = require('express');
const path = require('path');
const Joi = require('joi');
const bodyParser = require('body-parser');
const db = require('./queries');
const dotenv = require('dotenv');
const pg = require('pg');
const app = express();

app.use(bodyParser.json());
app.use(express.json());

app.use('/public',express.static(path.join(__dirname,'static')));
app.use(bodyParser.urlencoded({extended: false})); 

dotenv.config();
