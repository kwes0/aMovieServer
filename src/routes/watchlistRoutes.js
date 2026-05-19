import express from "express";
import { addToWatchlist } from "../controllers/watchlistController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

//Apply middlewares
router.use(authMiddleware);

//route definitions
// Add movies to the watchlist
router.post("/addToWatchlist", addToWatchlist);

export default router;
