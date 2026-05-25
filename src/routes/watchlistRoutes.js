import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  addToWatchlist,
  deleteFromWatchlist,
  getMyWatchlist,
  updateStatusOnWatchlist,
} from "../controllers/watchlistController.js";
import { validateWatchlistItem } from "../middleware/watchlistValidators.js";
import {
  addToWatchlistSchema,
  updateWatchlistSchema,
} from "../validators/validateRequest.js";

const router = express.Router();

//Apply middlewares
router.use(authMiddleware);

//route definitions
//Get current user watchlist 
router.get("/myWatchlist", getMyWatchlist)
// Add movies to the watchlist

router.post(
  "/addToWatchlist",
  validateWatchlistItem(addToWatchlistSchema),
  addToWatchlist,
);

router.delete("/:id", deleteFromWatchlist);

router.put(
  "/:id",
  validateWatchlistItem(updateWatchlistSchema),
  updateStatusOnWatchlist,
);

export default router;
