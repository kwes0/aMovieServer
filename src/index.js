import express from "express";
import { config } from "dotenv";
import { connectDB, disconnectDB } from "./config/db.js";

//Call third party to start when the server starts
config();
connectDB();

//Initialize the express framework
const app = express();

//Port config and listening to the server
const PORT = 5001;
const server = app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});

//Handle unhandled promise rejection
process.on("unhandledRejection", (err) => {
  console.error(`Unhandled rejection: ${err.message}`);
  server.close(async () => {
    await disconnectDB();
    process.exit(1);
  });
});

//Handle uncaught exception
process.on("uncaughtException", async (err) => {
  console.error(`Unhandled exception: ${err.message}`);
  await disconnectDB();
  process.exit(1);
});

//Gracefully shutdowmn the server on SIGTERM signal
process.on("SIGTERM", async () => {
  console.log("SIGTERM received - Shutting down server.");
  server.close(async () => {
    await disconnectDB();
    process.exit(0);
  });
});
