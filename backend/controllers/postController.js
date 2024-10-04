import Post from "../models/postModel.js";
import {v2 as cloudinary} from 'cloudinary';
import User from "../models/userModel.js";
import Notificacao from "../models/notificacaoModel.js";

export const criarPost = async (req, res) => {
    try {
        const { texto } = req.body;
        let { imagem } = req.body;

        const userId = req.user._id.toString();

        const user = await User.findById(userId);

        if(!user) {
            return res.status(404).json({
                mensagem: "Usuário não encontrado"
            })
        }

        if (!texto && !imagem) {
            return res.status(400).json({
                erro: "Post tem que ter uma imagem ou um texto."
            })
        }

        if(imagem) {
            try {
                const uploadResponse = await cloudinary.uploader.upload(imagem)
                imagem = uploadResponse.secure_url
                console.log(imagem)
            } catch (error) {
                return res.status(500).json({
                    erro: "Erro no upload da imagem"
                })
            }
        }

        const novoPost = new Post({
            user: userId,
            texto,
            imagem
        })
        
        await novoPost.save();
        res.status(201).json(novoPost)

    } catch (error) {
        console.log("Erro no controller criarPost:", error.message)
        res.status(500).json({
            erro: "Erro interno do servidor"
        })
    }
};

export const deletarPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if(!post) {
            return res.status(404).json({
                erro: "Post não encontrado"
            })
        }

        if(post.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({
                erro: "Você não está autorizado a deletar esse post"
            })
        }

        if(post.imagem) {
            const imagemId = post.imagem.split('/').pop().split('.')[0]
            await cloudinary.uploader.destroy(imagemId)
        }

        await Post.findByIdAndDelete(req.params.id)

        return res.status(200).json({
            mensagem: "Post foi deletado com sucesso"
        })

    } catch (error) {
        console.log("Erro no controller deletarPost:", error.message)
        res.status(500).json({
            erro: "Erro interno do servidor"
        })
    }
};

export const comentarPost = async (req, res) => {
    try {
        const { texto } = req.body;
        const postId = req.params.id;
        const userId = req.user._id;

        if(!texto) {
            return res.status(400).json({
                erro: "O texto do comentário é obrigatório"
            })
        }

        const post = await Post.findById(postId);

        if(!post) {
            return res.status(404).json({
                erro: "O post não foi encontrado"
            })
        }

        const comentario = {
            user: userId,
            texto: texto,
        }

        post.comentarios.push(comentario);
        await post.save();
        res.status(200).json(post)

    } catch (error) {
        console.log("Erro no controlador comentarPost:", error.message)
        res.status(500).json({
            erro: "Erro interno do servidor"
        })
    }
};

export const toggleLikePost = async (req, res) => {
    try {
        const userId = req.user._id;
        const { id:postId } = req.params;

        const post = await Post.findById(postId)
        if(!post) {
            res.status(404).json({
                erro: "Post não foi encontrado"
            })
        }

        const isUserLiked = post.likes.includes(userId)
        if (isUserLiked) {
            await Post.updateOne({_id: postId}, {$pull: {likes: userId}})
            await User.updateOne({_id: userId}, {$pull: {posts_curtidos: postId}})

            const likesAtualizado = post.likes.filter((id) => id.toString() !== userId.toString());
            res.status(200).json(likesAtualizado)
        } else {
            // post.likes.push(userId);
            // await post.save();
            await Post.updateOne({_id: postId}, {$push: {likes: userId}})
            await User.updateOne({_id: userId}, {$push: {posts_curtidos: postId}})

            const notificacao = new Notificacao({
                de: userId,
                para: post.user,
                tipo:"like",
            })
            await notificacao.save();

            const postAtualizado = await Post.findById(postId);

            res.status(200).json(postAtualizado.likes)

        }

    } catch (error) {
        console.log("Erro no controller toggleLikePOst", error.message)
        res.status(500).json({
            erro: "Erro interno do servidor"
        })
    }
};

export const getPosts = async (req, res) => {
    try {
        const posts = await Post.find().sort({createdAt: -1}).populate({
            path: "user",
            select: "-senha",
        }).populate({
            path: "comentarios.user",
            select: "-senha",
        })

        if(posts.length==0) {
            return res.status(200).json([])
        }

        res.status(200).json(posts)
    } catch (error) {
        console.log("Erro no controller getPosts", error.message)
        res.status(500).json({
            erro: "Erro interno do servidor"
        })
    }
};

export const getPostsCurtidos = async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({
                erro: "Usuário não encontrado"
            })
        }

        const postsCurtidos = await Post.find({_id: {$in: user.posts_curtidos}}).populate({
            path: 'user',
            select: '-senha',
        }).populate({
            path: 'comentarios',
            select: '-senha',
        })

        res.status(200).json(postsCurtidos)
    } catch (error) {
        console.log("Erro no controller getPostsCurtidos:", error.message)
        res.status(500).json({
            erro: "Erro interno do servidor"
        })
    }
};

export const getPostsSeguindo = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = User.findById(userId);
        if(!user){
            return res.status(404).json({
                erro: "Usuário não encontrado"
            })
        }

        const seguindo = user.seguindo;

        const postsFeed = await Post.find({user: {$in: seguindo}}).sort({
            createdAt: -1
        }).populate({
            path: 'user',
            select: '-senha',
        }).populate({
            path: 'comentarios.user',
            select: '-senha',
        })

        res.status(200).json(postsFeed)

    } catch (error) {
        console.log("Erro no controller getPostsSeguindo:",error.message)
        res.status(500).json({
            erro: "Erro interno do servidor"
        })
    }
}

export const getPostsUser = async (req, res) => {
    try {
        const nomeUsuario = req.params.nome_usuario

        const user = await User.findOne({ nome_usuario: nomeUsuario});
        if (!user) {
            return res.status(404).json({
                erro: "Usuário não encontrado"
            })
        }

        const posts = await Post.find({user: user._id}).sort({createdAt: -1}).populate({
            path: 'user',
            select: '-senha',
        }).populate({
            path: 'comentarios.user',
            select: '-senha',
        })

        res.status(200).json(posts);

    } catch (error) {
        console.log("Erro no controller getPostsUser:", error.message)
        res.status(500).json({
            erro: "Erro interno do servidor"
        })
    }
}