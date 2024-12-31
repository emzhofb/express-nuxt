import multer from 'multer';
import path from 'path';

// Initialize upload directory
const uploadsDir = path.resolve(__dirname, '../uploads');
const delimiter = ' :v-|-:v ';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Generate the filename: original name + timestamp (or ID) to avoid collisions
    const originalNameWithoutExt = path.parse(file.originalname).name; // Get the original filename without the extension
    const fileId = Date.now(); // Or generate a random ID, e.g., `Math.random().toString(36).substring(7)`
    const extension = path.extname(file.originalname); // Get the file extension
    const newFileName = `${originalNameWithoutExt}${delimiter}${fileId}${extension}`; // Combine original name and ID
    cb(null, newFileName);
  },
});

export const fileUploadMiddleware = multer({
  storage,
  // OWASP: Prevent Large File Uploads, limit file size
  limits: { fileSize: 10 * 1024 * 1024 },
  // OWASP: Validate file types to avoid unwanted files (e.g., .exe, .html, etc.)
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
});
