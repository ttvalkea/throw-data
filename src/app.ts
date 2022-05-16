import { createConnection, queryAllThrowData } from "./database";
import cors from "cors";
import express from "express";
import { Connection } from "promise-mysql";
import { createServer } from "http";
import { Server, ServerOptions } from "socket.io";
const app = express();

// --- CORS ---
app.use(cors());
const port = 8081;
const hostname = "127.0.0.1";

// --- Socket.io ---
const httpServer = createServer(app);
const socketIoPort = 3001;
const frontendClientPort = 3000;
const corsOptions: cors.CorsOptions = {
  origin: `http://localhost:${frontendClientPort}`,
  methods: ["GET", "POST"],
  credentials: false,
};
const ioOptions: Partial<ServerOptions> = {
  cors: corsOptions,
};
const io = new Server(httpServer, ioOptions);
io.on("connection", (socket) => {
  // If some socket.io events need to be listened for, add them here.
  // socket.on("event-name", (arg) => {
  //   console.log(arg);
  // });
});

httpServer.listen(socketIoPort);

// --- Endpoints ---
let connection: Connection | undefined = undefined;

// Returns all throw data
app.get("/throw-data", async (req, res) => {
  if (!connection) {
    connection = await createConnection();
  }
  const allThrowData = await queryAllThrowData(connection);
  res.end(JSON.stringify(allThrowData));
});

// TODO: Endpoint for adding throws. When called, insert new row to db and send a message with socket to the frontend that new data has been added.

app.get("/socket-io", (req, res) => {
  const socketIoClientCount = io.engine.clientsCount;
  console.log("emitting...");
  io.emit("throw-data-updated"); // TODO: Emit this event from insert endpoint
  console.log("emitted.");
  res.end(`socket.io client count: ${JSON.stringify(socketIoClientCount)}`);
});

app.listen(port, () => {
  console.log("Throw data API app listening at http://%s:%s", hostname, port);
});
