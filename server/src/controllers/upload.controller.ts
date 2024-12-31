import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';

const uploadsDir = path.resolve(__dirname, '../uploads');
const delimiter = ' :v-|-:v ';

export const uploadFile = (req: Request, res: Response, next: NextFunction): void => {
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
};

export const listFiles = (req: Request, res: Response, next: NextFunction): void => {
  try {
    fs.readdir(uploadsDir, (err, files) => {
      if (err) {
        res.status(500).json({ error: 'Unable to scan files.' });
        return;
      }

      const fileList = files.map(file => ({
        id: file.split(delimiter)[1],
        filename: file.split(delimiter)[0],
        path: `/uploads/${file}`,
      }));
      res.status(200).json(fileList);
    });
  } catch (error) {
    next(error);
  }
};
