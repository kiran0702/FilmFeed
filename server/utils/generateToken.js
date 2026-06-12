import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "filmfeed-development-secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

const getUserId = (user) => user?.id || user?._id?.toString();

export const generateToken = (user) => {
  return jwt.sign(
    {
      id: getUserId(user),
      name: user.name,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN },
  );
};

export const verifyToken = (token) => {
  if (!token) {
    return null;
  }

  try {
    const normalizedToken = token.startsWith("Bearer ")
      ? token.slice(7)
      : token;

    return jwt.verify(normalizedToken, JWT_SECRET);
  } catch {
    return null;
  }
};
