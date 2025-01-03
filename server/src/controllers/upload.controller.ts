import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import File from '../models/file.model';

export const uploadFile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded.' });
      return;
    }
    const uploadedFilePath = path.join('/uploads', path.basename(req.file.path));
    const newFile = await File.create({
      filename: req.file.filename,
      path: uploadedFilePath,
    });
    
    // OWASP: Log file upload success (a logging system can be added here for production)
    console.log(`file uploaded: ${req.file.filename}`);
    res.status(200).json({ file: newFile });
  } catch (error) {
    res.status(500).json({ error: 'failed to upload file.' });
  }
};

export const listFiles = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 10;
  const skip = (page - 1) * limit;

  try {
    const [files, total] = await Promise.all([
      File.find().skip(skip).limit(limit),
      File.countDocuments(),
    ]);

    res.status(200).json({
      total,
      page,
      files,
    });
  } catch (error) {
    res.status(500).json({ error: 'failed to fetch files.' });
  }
};

export const deleteFile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;

  try {
    const file = await File.findByIdAndDelete(id);
    // if want to soft delete
    // const file = await File.findByIdAndUpdate(id, { is_deleted: true });

    if (!file) {
      res.status(404).json({ error: 'file not found.' });
      return;
    }

   // Assuming files are stored in 'server/src/uploads/'
    const uploadsDirectory = path.resolve(__dirname, '..'); // Adjust this path to where your files are stored

    // Remove the leading slash from the file path, if it exists
    const relativePath = file.path.replace(/^\/+/, ''); // Remove leading slash
    const filePath = path.join(uploadsDirectory, relativePath);

    try {
      fs.unlinkSync(filePath); // Delete the file from the filesystem

      // OWASP: Log file deletion success (a logging system can be added here for production)
      console.log(`file deleted: ${file?.filename}`);
    } catch (error) {
      console.error('Error deleting file:', error);
    }

    res.status(200).json({ message: 'file deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

