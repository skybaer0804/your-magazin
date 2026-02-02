import express from 'express';
import {
  getMagazines,
  getMagazineById,
  createMagazine,
  updateMagazine,
  deleteMagazine,
} from '../controllers/magazineController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getMagazines);
router.get('/:id', getMagazineById);
router.post('/', protect, createMagazine);
router.put('/:id', protect, updateMagazine);
router.delete('/:id', protect, deleteMagazine);

export default router;
