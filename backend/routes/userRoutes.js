import express from 'express';
import { protectRoute } from '../middleware/protectRoute.js';
import { getPerfilUsuario, seguirToggleUsuario, getUsuariosSugeridos, atualizarPerfilUsuario } from '../controllers/userController.js';

const router = express.Router();

router.get("/perfil/:nome_usuario", protectRoute, getPerfilUsuario)
router.get("/sugeridos", protectRoute, getUsuariosSugeridos)
router.post("/seguir/:id", protectRoute, seguirToggleUsuario)
router.post("/atualizar", protectRoute, atualizarPerfilUsuario)

export default router;