const express = require("express");
const app = express();
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');
//config .env file
require("dotenv").config();
//config Database
require("./config/Database").connect();
//routes added here
const router = require("./routes/AuthenticationRoutes");
const  routerTeam = require('./routes/TeamRoutes')
const userDetail = require('./routes/UserDetailsRoutes')
const utilityRoutes = require('./routes/UtilityRoutes')
const EventManagerRoute = require('./routes/EventManagerRoute')
//middleWares
const bodyParser = require("body-parser");
const cors = require("cors"); //to handle cors origin error we use cors
// app.use(morgan('combined'));
app.use(morgan(':date[web] :method :url :status :response-time ms - :res[content-length]'));
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

//Map Router to Path
app.use("/api", router);
app.use("/api",routerTeam)
app.use("/api",userDetail)
app.use("/api",EventManagerRoute)
app.use("/api",utilityRoutes)

// api document 
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//server listen
app.listen(process.env.PORT, () => {
  console.log(`server is started ${process.env.PORT}`);
});
