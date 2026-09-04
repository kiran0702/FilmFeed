import mongoose from "mongoose";

const listSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxLength: 100,
    },
    description: {
      type: String,
      trim: true,
      maxLength: 500,
    },
    movies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }],
    isPublic: {
      type: Boolean,
      default: true,
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

const List = mongoose.model("List", listSchema);

export default List;
