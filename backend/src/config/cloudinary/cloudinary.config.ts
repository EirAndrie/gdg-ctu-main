import { v2 as cloudinary } from "cloudinary";

export function isCloudinaryEnabled(): boolean {
      const url = process.env.CLOUDINARY_URL;
      return typeof url === "string" && url.trim().length > 0;
}

if (isCloudinaryEnabled()) {
      cloudinary.config();
}

export default cloudinary;
