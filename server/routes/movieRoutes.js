import express from "express";
import {
  getMovieCastDetails,
  getMovieVideosList,
  getSimilarMovieList,
  getmoviebyID,
  getpopmovie,
  gettoprated,
  gettrdmovie,
  gettrdtv,
  getupcommingmovies,
  searchMovies,
} from "../controllers/movieController.js";
import { authenticate } from "../middleware/authMiddleware.js";
const router = express.Router();
router.use(authenticate);
router.get("/popular", getpopmovie);
router.get("/trending", gettrdmovie);
router.get("/trending-tv", gettrdtv);
router.get("/upcoming", getupcommingmovies);
router.get("/toprated", gettoprated);
router.get("/search", searchMovies);
router.get("/details/:id", getmoviebyID);
router.get("/:id/cast", getMovieCastDetails);
router.get("/:id/similar", getSimilarMovieList);
router.get("/:id/videos", getMovieVideosList);
export default router;
