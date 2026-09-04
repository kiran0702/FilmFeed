import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const createUserId = () =>
  `user_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`;

const movieSnapshotSchema = new mongoose.Schema(
  {
    id: {
      type: [String, Number],
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    posterPath: {
      type: String,
      default: null,
    },
    backdropPath: {
      type: String,
      default: null,
    },
    rating: {
      type: Number,
      default: 0,
    },
    releaseYear: {
      type: Number,
      default: null,
    },
    overview: {
      type: String,
      default: "",
    },
    genres: {
      type: [String],
      default: [],
    },
    category: {
      type: String,
      default: "movie",
    },
  },
  { _id: false },
);

const userSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      default: createUserId,
      index: true,
    },
    username: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    avatar: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
    },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    favorites: { type: [movieSnapshotSchema], default: [] },
    watchlist: { type: [movieSnapshotSchema], default: [] },
    watchedMovies: { type: [movieSnapshotSchema], default: [] },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      transform: (_, ret) => {
        delete ret._id;
        delete ret.password;
        return ret;
      },
    },
    toObject: {
      transform: (_, ret) => {
        delete ret._id;
        delete ret.password;
        return ret;
      },
    },
  },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
