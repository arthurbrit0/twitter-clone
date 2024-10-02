import express from 'express';
import { fazerCadastro, fazerLogin, fazerLogout } from '../controllers/authController.js';

const router = express.Router();

router.post("/cadastro", fazerCadastro)

router.post("/login", fazerLogin)

router.post("/logout", fazerLogout)

export default router;