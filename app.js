/*
* Title: Storage Management System
* Description: a Storage Management System while following the MVC design pattern. 
* Author: Tabassum Tara Lamia
* Date: 14/02/2025
*/
//external imports

const mongoose = require('mongoose');
const http = require('http');
const dotenv = require('dotenv');
const path = require("path");
const cookieParser = require("cookie-parser");
const moment = require("moment");
const express = require('express');
const loginRouter = require("./router/loginRouter");
const favoriteRouter = require("./router/favoriteRouter");
const homeRouter = require("./router/homeRouter");
const calendarRouter = require("./router/calendarRouter");
const profileRouter = require("./router/profileRouter");

// internal imports

const {notFoundHandler,errorHandler} = require("./middlewares/common/errorHandler");

const app = express();
dotenv.config();

//database connection
mongoose.connect(process.env.MONGO_CONNECTION_STRING,{
    useNewUrlParser : true,
useUnifiedTopology: true
})
.then(() => console.log("Database Connection Successful!"))
.catch(err => console.log(err));

//request parsers
app.use(express.json());
app.use(express.urlencoded({extended : true})); //=> for views

app.use((req, res, next) => {
    console.log(" Request received!");
    console.log(" Method:", req.method);
    console.log(" Path:", req.path);
    console.log(" Body:", req.body);
    console.log(" Query Params:", req.query);
    console.log("---------------------------");
    next();
}); // for debugging purpose

//set view engine
//here's the view code

// set static folder (public folder)
app.use(express.static(path.join(__dirname,"public")));

//parse cookies
app.use(cookieParser(process.env.COOKIE_SECRET));
// routing setup
app.use('/login',loginRouter);
/*app.use('/home',homeRouter);
app.use('/favorite',favoriteRouter);
app.use('/calendar',calendarRouter);
app.use('profile',profileRouter);*/

//404 not found handling
app.use(notFoundHandler);

//common error handler
app.use(errorHandler);

app.listen(process.env.PORT,()=>{
    console.log(`app listening to port ${process.env.PORT}`);
});
