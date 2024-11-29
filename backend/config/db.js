import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(`MongoDB connected ${conn.connection.host}`);
  } catch (err) {
    console.log(`Error: ${err}`);
    process.exit();
  }
};
export default connectDB;
