// ## Movie routes
//   - Get all movies - anon
//   - Create new movie by a current user - user specific
//   - Get a movie - anon

import express from "express";
import {
  addMovie,
  allMovies,
  getAMovie,
} from "../controllers/moviesController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", allMovies);
router.post("/addMovie", authMiddleware, addMovie);
router.get("/:id", getAMovie);

export default router;
