import Movie from "../models/movieModel.js";
import { defaultMovies } from "../data/defaultMovies.js";

export const seedDatabase = async () => {
  await Movie.seedDefaultMovies(defaultMovies);
};
