import { Router } from "express";
import { registerValidator, loginValidator } from "../validators/auth.validator.js";
import { getMe, login, register, verifyEmail } from "../controllers/auth.controller.js";
import { authUser } from "../middlewares/auth.middleware.js";

const authrouter = Router();

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 * @body {string} username - The username of the user
 * @body {string} email - The email of the user
 * @body {string} password - The password of the user
 * */

authrouter.post("/register", registerValidator, register);

/**
 * @route POST /api/auth/login
 * @desc Login a user
 * @access Public
 * @body {string} email - The email of the user
 * @body {string} password - The password of the user
 * */
    
    authrouter.post("/login", loginValidator, login);

/**
 * @route GET /api/auth/profile
 * @desc Get user profile
 * @access Private
 */

authrouter.get("/get-me", authUser, getMe)

/**
 * @route GET /api/auth/verify-email
 * @desc Verify user's email
 * @access Public
 */
authrouter.get("/verify-email", verifyEmail);



export default authrouter;
