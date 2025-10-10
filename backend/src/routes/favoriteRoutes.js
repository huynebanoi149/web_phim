import { Router } from 'express';
import * as ctrl from '../controllers/favoriteController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = Router();

// ===== Các route cho user (phải đăng nhập) ====
router.get('/', verifyToken, ctrl.getFavorites);
router.post('/:movieId', verifyToken, ctrl.addFavorite);
router.delete('/:movieId', verifyToken, ctrl.removeFavorite);

export default router;
