import { Router } from 'express';
import multer from 'multer';
import { uploadFile, listFiles } from '../controllers/upload.controller';
import { fileUploadMiddleware } from '../utils/fileupload';

const router = Router();

router.post('/upload', fileUploadMiddleware.single('file'), uploadFile);
router.get('/files', listFiles);

export default router;
