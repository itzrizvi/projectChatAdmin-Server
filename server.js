const cors = require("cors");
const { MongoClient } = require("mongodb");
const express = require("express");
const app = express();
const { createServer } = require("http");
const { Server } = require("socket.io");
require("dotenv").config();
const connection = require("./db");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const conversationRoutes = require("./routes/conversations");
const messageRoutes = require("./routes/messages");
const userData = require("./routes/userData");

//  DB Connect by Mongoose
connection();

//  Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/userdata", userData);

//  PORT
const port = 5000 || process.env.PORT;

// SERVER
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const uri =
  "mongodb+srv://chatBox:SpiderMan(NoWayHome)@cluster1.fprcc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("chatBox");
    const userAdminsCollection = database.collection("user_Admins");
    // const msgHistoryCollection = database.collection('twinMessege_history');
    console.log("DB CONNECTED");

    // // GET all admins
    app.get("/admins", async (req, res) => {
      const cursor = userAdminsCollection.find({});
      const allAdmins = await cursor.toArray();
      res.send(allAdmins);
    });

    // Query Admins
    app.get("/admins/:name", async (req, res) => {
      const name = req.params.name;
      const query = { name: name };
      const adminMatched = await userAdminsCollection.findOne(query);
      res.json(adminMatched);
    });

    // POST MSG HISTORY
    // app.post('/msghistory', async (req,res)=>{
    //     const messegeReq = req.body;
    //     console.log(messegeReq);
    //     const result = await msgHistoryCollection.insertOne(messegeReq);
    //     res.json(result);
    // });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.status(200).json({ name: "Server" });
});

const users = {};

io.on("connection", (socket) => {
  console.log("Some one is Connected and Socket ID " + socket.id);

  socket.on("disconnect", () => {
    console.log(`${socket.id} is Disconnected`);

    // Remove Disconnected User
    for (let user in users) {
      if (users[user] === socket.id) {
        delete users[user];
      }
    }

    io.emit("all_users", users);
  });

  socket.on("new_user", (userName) => {
    console.log(`Server: ${userName}`);
    users[userName] = socket.id;

    // Tell Others that someone connected
    io.emit("all_users", users);
  });

  socket.on("send_messege", (data) => {
    console.log(data);
    const socketId = users[data.receiver];
    console.log(socketId);
    io.to(socketId).emit("new_messege", data);
  });

  socket.on("typingProcess", (typingKeys) => {
    socket.broadcast.emit("typingProcess", typingKeys);
  });
});

httpServer.listen(port, () => {
  console.log(`Server Listening on port : ${port}`);
});
