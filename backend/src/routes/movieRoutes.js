import { Router } from 'express';
import * as ctrl from '../controllers/movieController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = Router();

const requireAdmin = (req, res, next) => {
  req.user?.role === 'admin'
    ? next()
    : res.status(403).json({ message: 'Forbidden' });
};

// ===== Public routes =====
router.get('/', ctrl.list);
router.get('/popular', ctrl.popular);
router.get('/discover', ctrl.discover);
router.get('/search', ctrl.search);
router.get('/:id/videos', ctrl.videos);
router.get('/:id/recommendations', ctrl.getRecommendations);
router.get('/:id', ctrl.getOne);

// ===== Admin routes =====
router.post('/', verifyToken, requireAdmin, ctrl.create);
router.put('/:id', verifyToken, requireAdmin, ctrl.update);
router.delete('/:id', verifyToken, requireAdmin, ctrl.remove);
router.post('/import/tmdb', verifyToken, requireAdmin, ctrl.importFromTmdb);

export default router;
