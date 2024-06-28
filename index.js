const http = require("http");
const express = require("express");
const app = express();
const morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./swagger.yaml");
const socketIo = require("socket.io");
const cors = require("cors");
const AWS = require("aws-sdk");
const multer = require("multer");
const unzipper = require("unzipper");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");

const port = 8000;

app.use(express.json());
app.use(cors());

const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: "*",
  },
});

let messages = [];

io.on("connection", (socket) => {
  console.log("New client connected", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected", socket.id);
  });

  socket.on("message", (newMessage) => {
    messages.push(newMessage);
    io.emit("message", newMessage); // Broadcast message to all connected clients
  });

  // Handle thumb up
  socket.on("thumbUp", (messageId) => {
    const messageToUpdate = messages.find((msg) => msg.id === messageId);
    if (messageToUpdate) {
      messageToUpdate.thumbUpCount++;
      io.emit("messageUpdated", messageToUpdate);
    }
  });

  // Handle thumb down
  socket.on("thumbDown", (messageId) => {
    const messageToUpdate = messages.find((msg) => msg.id === messageId);
    if (messageToUpdate) {
      messageToUpdate.thumbDownCount++;
      io.emit("messageUpdated", messageToUpdate);
    }
  });

  // Send existing messages to newly connected client
  socket.emit("initialMessages", messages);
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
const dashboardModuleRouter = require("./routes/DashboardModuleRoutes");
//middleWares
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
app.use("/api", dashboardModuleRouter);
// api document
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//server listen
server.listen(process.env.PORT, () => {
  console.log(`server is started ${process.env.PORT}`);
});
