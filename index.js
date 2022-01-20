const express = require("express");
const mongoose = require("mongoose");
const authRouter = require("./routers/auth-router");
const PORT = process.env.PORT || 5000;
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(`/auth`, authRouter);

const start = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://Awake:AwkDev@cluster0.hdk6u.mongodb.net/quiz-app?retryWrites=true&w=majority`
    );
    server.listen(PORT, () => `Server started on port ${PORT}`);
  } catch (e) {
    console.log(e);
  }
};

start();

io.on("connection", (socket) => {
  console.log("connected");
});
