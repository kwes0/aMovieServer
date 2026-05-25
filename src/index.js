import express from "express";
import { config } from "dotenv";
import { connectDB, disconnectDB } from "./config/db.js";

//IMPORT ROUTES
import authRoutes from "./routes/authRoutes.js";
import watchlistRoutes from "./routes/watchlistRoutes.js";
import moviesRoutes from "./routes/moviesRoutes.js";

//Call third party to start when the server starts
config();
connectDB();

//Initialize the express framework
const app = express();

//Body parsing middleware
app.use(express.json()); //This ensures that JSON data is handled. Node and express don't handle JSON by default and require a parser.
app.use(express.urlencoded({ extended: true })); //Ensures data from html is handled properly. Extended is such that nested objects are also parsed.

//USE IMPORTED ROUTES
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/watchlist", watchlistRoutes);
app.use("/api/v1/movies", moviesRoutes);

//Port config and listening to the server
const PORT = 5001;
const server = app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
}); //We need to create an instance of the server so that we can handle the instance errors.

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
