import mongoose from "mongoose";

const createUserId = () =>
  `user_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`;

const userSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      default: createUserId,
      index: true,
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

const User = mongoose.model("User", userSchema);

export default User;
