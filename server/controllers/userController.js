import User from "../models/userModel.js";
import { sanitizeUser } from "./authController.js";

export const getCurrentUser = async (req, res) => {
  const authenticatedUser = await User.findOne({ id: req.user.id });

  if (!authenticatedUser) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.status(200).json({ user: sanitizeUser(authenticatedUser) });
};

export const getAllUsers = async (req, res) => {
  const users = await User.find().sort({ createdAt: 1 });

  return res.status(200).json({
    count: users.length,
    users: users.map(sanitizeUser),
  });
};
