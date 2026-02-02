import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = process.env.UPLOAD_DIR || './uploads';
const maxFileSize = parseInt(process.env.MAX_FILE_SIZE) || 209715200; // 200MB

const imageDir = path.join(uploadDir, 'images');
const videoDir = path.join(uploadDir, 'videos');

[imageDir, videoDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const generateFilename = (originalName) => {
  const ext = path.extname(originalName).toLowerCase();
  const random = Math.random().toString(36).substring(2, 11);
  return `${Date.now()}-${random}${ext}`;
};

const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, imageDir),
  filename: (req, file, cb) => cb(null, generateFilename(file.originalname)),
});

const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, videoDir),
  filename: (req, file, cb) => cb(null, generateFilename(file.originalname)),
});

const imageFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|webp/;
  const ext = path.extname(file.originalname).toLowerCase().slice(1);
  const mimetype = file.mimetype;
  if (allowed.test(ext) || mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('이미지 파일만 업로드 가능합니다. (jpg, png, gif, webp)'));
  }
};

const videoFilter = (req, file, cb) => {
  const allowed = /mp4|webm|ogg/;
  const ext = path.extname(file.originalname).toLowerCase().slice(1);
  const mimetype = file.mimetype;
  if (allowed.test(ext) || mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('비디오 파일만 업로드 가능합니다. (mp4, webm, ogg)'));
  }
};

export const uploadImage = multer({
  storage: imageStorage,
  limits: { fileSize: 52428800 }, // 50MB
  fileFilter: imageFilter,
}).single('image');

export const uploadVideo = multer({
  storage: videoStorage,
  limits: { fileSize: maxFileSize },
  fileFilter: videoFilter,
}).single('video');
