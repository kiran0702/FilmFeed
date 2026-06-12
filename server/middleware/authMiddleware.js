import { verifyToken } from "../utils/generateToken.js";

export const authenticate = (req, res, next) => {
  const authorizationHeader = req.headers.authorization;
  const decodedToken = verifyToken(authorizationHeader);

  if (!decodedToken) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  req.user = decodedToken;
  return next();
};

export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    return next();
  };
};