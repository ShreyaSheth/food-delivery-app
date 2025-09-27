import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URL);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);

    // Test if we can perform operations
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    console.log(
      "Available collections:",
      collections.map((c) => c.name)
    );
    // await mongoose.connect(process.env.MONGODB_URL);
    // console.log("Database connected");
  } catch (error) {
    console.log("DB error", error);
  }
};

export default connectDB;
