import multer from "multer"

// Configure multer storage
const upload = multer({ storage: multer.memoryStorage() }); // Files will be saved in the "uploads" directory

// Apply the multer middleware
export const uploadMiddleware = upload.single("file"); // "file" should match the key in your FormData
