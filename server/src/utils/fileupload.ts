import multer from 'multer';
import path from 'path';

// Initialize upload directory
const uploadsDir = path.resolve(__dirname, '../uploads');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext);
    cb(null, `${baseName}-${timestamp}${ext}`);
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
