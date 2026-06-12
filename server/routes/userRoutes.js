import express from "express"
import { authenticate, authorizeRoles } from "../middleware/authMiddleware.js"
import { getAllUsers, getCurrentUser } from "../controllers/userController.js"
const router = express.Router()
router.get("/me", authenticate, getCurrentUser)
router.get("/", authenticate, authorizeRoles("admin"), getAllUsers)
export default router