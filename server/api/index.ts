import express, { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import helmet from 'helmet'; // Helmet for setting security-related HTTP headers

// Initialize Express app
const app = express();
const port = 5000;
const delimiter = ' :v-|-:v ';

// Enable CORS for frontend communication
app.use(cors());

// Use Helmet to set secure HTTP headers to mitigate XSS, clickjacking, and other attacks
app.use(helmet());

// Ensure the "uploads" directory exists
const uploadsDir = path.resolve(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Serve static files from the "uploads" directory
app.use('/uploads', express.static(uploadsDir)); // This line allows you to access files in the uploads directory

// File upload setup
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

const upload = multer({ 
  storage, 
  // OWASP: Prevent Large File Uploads, limit file size
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit files to 10MB
  // OWASP: Validate file types to avoid unwanted files (e.g., .exe, .html, etc.)
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  }
});

// Route to upload a file
app.post(
  '/upload',
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      if (!req.file) {
        res.status(400).json({ error: 'No file uploaded.' });
        return;
      }
      // OWASP: Log file upload success (a logging system can be added here for production)
      console.log(`File uploaded: ${req.file.filename}`);
      res.status(200).json({ filename: req.file.filename });
    } catch (error) {
      next(error);
    }
  }
);

// Route to list uploaded files
app.get('/files', (req: Request, res: Response, next: NextFunction): void => {
  try {
    fs.readdir(uploadsDir, (err, files) => {
      if (err) {
        res.status(500).json({ error: 'Unable to scan files.' });
        return;
      }

      const fileList = files.map(file => ({ id: file.split(delimiter)[1], filename: file.split(delimiter)[0], path: `/uploads/${file}` }));
      res.status(200).json(fileList);
    });
  } catch (error) {
    next(error);
  }
});

module.exports = app;
