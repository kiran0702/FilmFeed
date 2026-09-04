import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    actionType: {
      type: String,
      enum: ["WATCHLIST_ADD", "FAVORITE_ADD", "WATCHED_ADD", "REVIEW_ADD"],
      required: true,
    },
    movie: {
      id: { type: String, required: true },
      title: { type: String, required: true },
      posterPath: { type: String },
      releaseYear: { type: Number },
      overview: { type: String },
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      transform: (_, ret) => {
        const id = ret._id;
        delete ret._id;
        return { id, ...ret };
      },
    },
  }
);

const Activity = mongoose.model("Activity", activitySchema);

export default Activity;
