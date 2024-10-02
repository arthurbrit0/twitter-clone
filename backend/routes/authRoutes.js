import express from 'express';
import { fazerCadastro, fazerLogin, fazerLogout, getMe } from '../controllers/authController.js';
import { protectRoute } from '../middleware/protectRoute.js';

const router = express.Router();


router.get("/me", protectRoute, getMe)

router.post("/cadastro", fazerCadastro)

router.post("/login", fazerLogin)

router.post("/logout", fazerLogout)

export default router;