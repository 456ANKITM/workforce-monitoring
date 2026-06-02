import multer from "multer";

const storage = multer.memoryStorage();

export const upload = multer({ storage });

export const uploadFields = upload.fields([
  { name: "selfie", maxCount: 1 },
]);