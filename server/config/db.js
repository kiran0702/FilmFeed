import mongoose from "mongoose";

const connectDB = async () => {
  const mongoUrl = process.env.MONGO_URL;

  if (!mongoUrl) {
    throw new Error("MONGO_URL is not defined");
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  const connection = await mongoose.connect(mongoUrl);

  console.log(`MongoDB connected: ${connection.connection.host}`);

  return connection;
};

export default connectDB;
