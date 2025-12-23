import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const connectedInstance = await mongoose.connect(
      `${process.env.MONGODB}/${process.env.DB_NAME}`
    );
    console.log("DB connected successfully", connectedInstance.connection.host);
  } catch (error) {
    console.log(
      "Some error occured while connecting to database",
      error.message
    );
    process.exit(1);
  }
};
