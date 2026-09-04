import jwt from "jsonwebtoken";

const getJwtSecret = () => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  return process.env.JWT_SECRET;
};

const getJwtExpiresIn = () => process.env.JWT_EXPIRES_IN || "7d";

const getUserId = (user) => user?.id || user?._id?.toString();

export const generateToken = (user) => {
  return jwt.sign(
    {
      id: getUserId(user),
      name: user.name,
      email: user.email,
      role: user.role,
    },
    getJwtSecret(),
    { expiresIn: getJwtExpiresIn() },
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

    return jwt.verify(normalizedToken, getJwtSecret());
  } catch {
    return null;
  }
};
