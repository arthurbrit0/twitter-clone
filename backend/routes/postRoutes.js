import express from 'express';
import { protectRoute } from '../middleware/protectRoute.js';
import { criarPost, deletarPost, comentarPost, toggleLikePost, getPosts, getPostsCurtidos, getPostsSeguindo, getPostsUser } from '../controllers/postController.js';

const router = express.Router();

router.get("/todos", protectRoute, getPosts);
router.get("/seguindo", protectRoute, getPostsSeguindo);
router.get("/likes/:id", protectRoute, getPostsCurtidos);
router.get("/user/:nome_usuario", protectRoute, getPostsUser);

router.post("/criar", protectRoute, criarPost);
router.post("/like/:id", protectRoute, toggleLikePost);
router.post("/comentar/:id", protectRoute, comentarPost);

router.delete("/deletar/:id", protectRoute, deletarPost);

export default router;