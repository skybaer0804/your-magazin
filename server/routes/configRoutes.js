import express from 'express';
import { getConfig, updateConfig } from '../controllers/configController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getConfig);
router.put('/', protect, updateConfig); // 실제 운영 환경에서는 관리자 권한 체크 추가 필요

export default router;
