import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: '이미지 파일을 선택해주세요.' });
    }

    const url = `/uploads/images/${req.file.filename}`;
    res.json({ url, filename: req.file.filename });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const uploadVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: '비디오 파일을 선택해주세요.' });
    }

    const url = `/uploads/videos/${req.file.filename}`;
    res.json({ url, filename: req.file.filename, videoType: 'upload' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
