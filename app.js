const express = require('express')
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser'); 
const mongoose = require('mongoose');

const productRoutes = require('./api/routes/products')
const orderRoutes = require('./api/routes/orders')

mongoose.connect('mongodb://localhost:27017/node-rest-shop',{useUnifiedTopology : true, useNewUrlParser: true}, (error)=>{
    if(!error) console.log("Success.. Database")
    else console.log("Error connecting database...")
})

app.use(morgan('dev'))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json());

//to handle CORS error..
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    //res.header("Access-Control-Allow-Origin", "Your client URL");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if(req.method == 'OPTIONS') {
        res.header("Access-Control-Allow-Methods", 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next(); //don't forget tp call next either every request will stop here.
});

//Routes which handle requests
app.use('/products', productRoutes);
app.use('/orders',orderRoutes);

app.use((req, res, next) => {
    const error = new Error('Not Found'); //Error() object available by default
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error : {
            message: error.message
        }
    })
});

module.exports = app;
