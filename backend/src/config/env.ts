import dotenv from "dotenv";
dotenv.config();

const ENV = {
      PORT: process.env.PORT,
      NODE_ENV: process.env.NODE_ENV,
      DB_URL: process.env.DB_URL,
      FR_ORIGIN: process.env.FR_ORIGIN,
      CLOUDINARY_URL: process.env.CLOUDINARY_URL,
      CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY,
      CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
      REDIS_URL: process.env.REDIS_URL,
};

export default ENV;
