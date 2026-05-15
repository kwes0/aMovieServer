import express from "express";
import { register, login } from "../controllers/authControllers.js";

const router = express.Router();

//route definitions
//Register user route
router.post("/register", register);
//Login route
router.post("/login", login);

export default router;
