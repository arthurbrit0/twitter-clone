import express from 'express'
import { protectRoute } from '../middleware/protectRoute.js';
import { getNotificacoes, deletarNotificacoes, deletarNotificacao } from '../controllers/notificacoesController.js';

const router = express.Router();

router.get('/', protectRoute, getNotificacoes);
router.delete('/', deletarNotificacoes);

export default router;