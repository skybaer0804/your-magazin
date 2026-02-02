import express from 'express';
import { uploadImage as uploadImageMw, uploadVideo as uploadVideoMw } from '../middleware/uploadMiddleware.js';
import { uploadImage, uploadVideo } from '../controllers/uploadController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/image', protect, (req, res, next) => {
  uploadImageMw(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message || '이미지 업로드 실패' });
    }
    next();
  });
}, uploadImage);

router.post('/video', protect, (req, res, next) => {
  uploadVideoMw(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message || '비디오 업로드 실패' });
    }
    next();
  });
}, uploadVideo);

export default router;
