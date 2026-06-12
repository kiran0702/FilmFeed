import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["trending", "popular", "upcoming", "toprated"],
      index: true,
    },
    genres: {
      type: [String],
      default: [],
    },
    rating: {
      type: Number,
      required: true,
    },
    releaseYear: {
      type: Number,
      required: true,
    },
    overview: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      transform: (_, ret) => {
        delete ret._id;
        return ret;
      },
    },
    toObject: {
      transform: (_, ret) => {
        delete ret._id;
        return ret;
      },
    },
  },
);

movieSchema.statics.seedDefaultMovies = async function (movies = []) {
  const movieCount = await this.countDocuments();

  if (movieCount > 0 || movies.length === 0) {
    return null;
  }

  return this.insertMany(movies);
};

const Movie = mongoose.model("Movie", movieSchema);

export default Movie;
