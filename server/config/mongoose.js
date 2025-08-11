import mongoose from"mongoose"
import dotenv from"dotenv"
dotenv.config()

const URL=process.env.DB_URL


export async function Dbconnection() {
  try {
    await mongoose.connect(URL);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log(" Failed to connect:", error.message);
    process.exit(1);
  }
}
