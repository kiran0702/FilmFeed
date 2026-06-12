import express from "express"
import {gettrdmovie,getpopmovie,getupcommingmovies,gettoprated,getmoviebyID,searchMovies} from "../controllers/movieController.js"
import { authenticate } from "../middleware/authMiddleware.js"
const router = express.Router()
router.use(authenticate)
router.get("/popular",getpopmovie) 
router.get("/trending",gettrdmovie)
router.get("/upcoming",getupcommingmovies)
router.get("/toprated",gettoprated)
router.get("/search", searchMovies)
router.get("/:id",getmoviebyID)
export default router
