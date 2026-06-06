import dotenv from "dotenv";

dotenv.config();

export const PORT: number = Number(process.env.PORT) || 5000;
export const MONGODB_URL: string =
  process.env.MONGODB_URL || "mongodb://localhost:27017/rentexpress-db";
