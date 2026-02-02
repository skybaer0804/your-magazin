import express from 'express';
import {
  getMagazines,
  getMagazineById,
  createMagazine,
  updateMagazine,
  deleteMagazine,
  toggleLikeMagazine,
  getMagazinesByMenu,
} from '../controllers/magazineController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getMagazines);
router.get('/:id', getMagazineById);
router.post('/', protect, createMagazine);
router.put('/:id', protect, updateMagazine);
router.delete('/:id', protect, deleteMagazine);
router.post('/:id/like', protect, toggleLikeMagazine);
router.get('/by-menu/:menuId', getMagazinesByMenu);

export default router;
