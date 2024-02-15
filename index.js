const express = require("express");
const app = express();
const morgan = require('morgan');

//config .env file
require("dotenv").config();
//config Database
require("./config/Database").connect();
const router = require("./routes/AuthenticationRoutes");
const  routerTeam = require('./routes/TeamRoutes')
//middleWares
const bodyParser = require("body-parser");
const cors = require("cors"); //to handle cors origin error we use cors
//Using Middleware
// app.use(morgan('combined'));
app.use(morgan(':date[web] :method :url :status :response-time ms - :res[content-length]'));

app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
//Map Router to Path
app.use("/api", router);

app.use("/api",routerTeam)
//server listen
app.listen(process.env.PORT, () => {
  console.log(`server is started ${process.env.PORT}`);
});
