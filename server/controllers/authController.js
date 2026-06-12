import User from "../models/userModel.js";
import { generateToken } from "../utils/generateToken.js";

const normalizeEmail = (email) => email.trim().toLowerCase();

export const sanitizeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
});

export const findUserById = async (id) => User.findOne({ id });

export const findUserByEmail = async (email) =>
  User.findOne({ email: normalizeEmail(email) });

export const signup = async (req, res) => {
  const { name, email, password } = req.body || {};

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "name, email, and password are required" });
  }

  const normalizedEmail = normalizeEmail(email);
  const existingUser = await findUserByEmail(normalizedEmail);

  if (existingUser) {
    return res.status(409).json({ message: "User already exists" });
  }

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password,
    role: "user",
  });

  return res.status(201).json({
    message: "user created",
    user: sanitizeUser(user),
    token: generateToken(user),
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ message: "email and password are required" });
  }

  const user = await findUserByEmail(email);

  if (!user || user.password !== password) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  return res.status(200).json({
    message: "user logged in",
    user: sanitizeUser(user),
    token: generateToken(user),
  });
};

export const logout = (req, res) => {
  return res.status(200).json({ message: "user logged out" });
};
