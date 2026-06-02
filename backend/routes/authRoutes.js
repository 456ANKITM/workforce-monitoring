import express from "express";
import { createEmployee, getMe, login, logout, signupAdmin } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/admin/signup", signupAdmin);
router.post("/create-employee", protect, createEmployee);
router.post("/login", login);
router.post("/logout", protect, logout);
router.get("/get-me", protect, getMe);

export default router;