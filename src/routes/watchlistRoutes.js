import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  addToWatchlist,
  deleteFromWatchlist,
  updateStatusOnWatchlist,
} from "../controllers/watchlistController.js";

const router = express.Router();

//Apply middlewares
router.use(authMiddleware);

//route definitions
// Add movies to the watchlist
router.post("/addToWatchlist", addToWatchlist);

router.delete("/:id", deleteFromWatchlist);

router.put("/:id", updateStatusOnWatchlist);

export default router;
