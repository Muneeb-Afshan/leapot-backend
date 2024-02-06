const express = require('express');
const app = express();
//config .env file
require("dotenv").config();
//config Database 
require("./config/Database").connect();
const router = require('./routes/AuthenticationRoutes')
//middleWares
const bodyParser=  require("body-parser")
const cors = require("cors");//to handle cors origin error we use cors
//Using Middleware
app.use(bodyParser.json({extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
//Map Router to Path
app.use("/api", router);
//server listen
app.listen(process.env.PORT,()=>{
    console.log(`server is started ${process.env.PORT}`)
})