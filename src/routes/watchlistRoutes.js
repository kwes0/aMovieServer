import express from "express";
import { addToWatchlist } from "../controllers/watchlistController.js";

const router = express.Router();

//route definitions
// Add movies to the watchlist
router.post("/addToWatchlist", addToWatchlist);

export default router;
