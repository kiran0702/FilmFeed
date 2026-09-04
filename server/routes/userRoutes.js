import express from "express"
import { authenticate, authorizeRoles } from "../middleware/authMiddleware.js"
import { getAllUsers, getCurrentUser, toggleFavorite, toggleWatchlist, toggleWatched, updateProfile, followUser, unfollowUser } from "../controllers/userController.js"
import { upload } from "../config/cloudinary.js"
const router = express.Router()

router.get("/me", authenticate, getCurrentUser)
router.put("/me", authenticate, upload.single('avatar'), updateProfile)
router.post("/me/favorites/toggle", authenticate, toggleFavorite)
router.post("/me/watchlist/toggle", authenticate, toggleWatchlist)
router.post("/me/watched/toggle", authenticate, toggleWatched)
router.post("/follow/:id", authenticate, followUser)
router.post("/unfollow/:id", authenticate, unfollowUser)

router.get("/", authenticate, authorizeRoles("admin"), getAllUsers)
export default router;