import * as multer from "multer";

const upload = multer.default({ storage: multer.memoryStorage() });
export default upload;
