const http = require("http");
const express = require("express");
const app = express();
const morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./swagger.yaml");
const socketIo = require('socket.io');

const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000", // Your frontend URL
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('message', (message) => {
    io.emit('message', message); // Broadcast the message to all clients
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

//config .env file
require("dotenv").config();
//config Database
require("./config/Database").connect();
//import and initialize cron jobs
require("./utilities/cronJobs");
//routes added here
const router = require("./routes/AuthenticationRoutes");
const routerTeam = require("./routes/TeamRoutes");
const userDetail = require("./routes/UserDetailsRoutes");
const utilityRoutes = require("./routes/UtilityRoutes");
const EventManagerRoute = require("./routes/EventManagerRoute");

const notificationRoute = require("./routes/NotificationRoutes");
const courseRouter = require("./routes/CourseRoutes");
const routerBlog = require("./routes/BlogsRoutes");
const routerTestimonial = require("./routes/TestimonialsRoutes");

const calendarRoute = require("./routes/CalendarRoutes");
const certificateRoute = require("./routes/CertificateRoutes");
const routerJob = require("./routes/JobRoutes");
const usermoduleRoute = require("./routes/UserModuleRoutes");


const RouterSiteBuilder = require('./routes/SiteBuilderRoutes')

//middleWares
const bodyParser = require("body-parser");
const cors = require("cors"); //to handle cors origin error we use cors
// app.use(morgan('combined'));
app.use(
  morgan(
    ":date[web] :method :url :status :response-time ms - :res[content-length]"
  )
);
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

//Map Router to Path
app.use("/api", router);
app.use("/api", routerTeam);
app.use("/api", userDetail);
app.use("/api", EventManagerRoute);

app.use("/api", certificateRoute);
app.use("/api", notificationRoute);

app.use("/api", calendarRoute);

app.use("/api", courseRouter);
app.use("/api", utilityRoutes);
app.use("/api", routerBlog);
app.use("/api", routerTestimonial);
app.use("/api", routerJob);
app.use("/api", usermoduleRoute);


app.use("/api", RouterSiteBuilder);

// api document
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//server listen
server.listen(process.env.PORT, () => {
  console.log(`server is started ${process.env.PORT}`);
});
