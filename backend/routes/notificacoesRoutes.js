import express from 'express'
import { protectRoute } from '../middleware/protectRoute.js';
import { getNotificacoes, deletarNotificacoes } from '../controllers/notificacoesController.js';

const router = express.Router();

router.get('/', protectRoute, getNotificacoes);
router.delete('/', protectRoute, deletarNotificacoes);

export default router;