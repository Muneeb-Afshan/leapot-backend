const http = require("http");
const express = require("express");
const app = express();
const morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./swagger.yaml");
const socketIo = require("socket.io");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path=require("path")

// Load environment variables
require("dotenv").config();

// Connect to database
require("./config/Database").connect();

const port = process.env.PORT || 8000;
const port = process.env.PORT || 8000;
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
  },
});

// Message storage
// Message storage
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

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan(":date[web] :method :url :status :response-time ms - :res[content-length]"));

// Routes
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
const RouterSiteBuilder = require('./routes/SiteBuilderRoutes');

// Use routes
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
app.use("/api", RouterSiteBuilder);

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/uploads', express.static(path.join(__dirname, './utilities/uploads')));



// Error handling middleware (must be placed last)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Start server
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
