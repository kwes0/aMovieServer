import express from "express";
import { register } from "../controllers/authControllers.js";

const router = express.Router();

//route definitions
//Register user route
router.post("/register", register);

export default router;
