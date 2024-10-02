import bcrypt from 'bcryptjs';
import {v2 as cloudinary} from 'cloudinary';

import Notificacao from '../models/notificacaoModel.js';
import User from '../models/userModel.js'


export const getPerfilUsuario = async (req, res) => {
    const {nome_usuario} = req.params;

    try {
        const user = await User.findOne({nome_usuario}).select('-senha');
        if (!user) {
            return res.status(404).json({
                erro: "Usuário não encontrado"
            })
        }

        res.status(200).json(user)

    } catch (error) {
        console.log("Erro no controller getPerfilUsuario:",error.message)
        res.status(500).json({
            erro: error.message
        })
    }


}

export const seguirToggleUsuario = async (req, res) => {
    try {
        const {id} = req.params;
        const usuarioModificado = await User.findById(id);
        const usuarioAtual = await User.findById(req.user._id)

        if(id === req.user._id.toString()) {
            return res.status(400).json({
                erro: "Você não pode seguir você mesmo!"
            })
        }

        if(!usuarioModificado ||!usuarioAtual) {
            return res.status(400).json({
                erro: "Usuário não encontrado"
            })
        }

        const isSeguindo = usuarioAtual.seguindo.includes(id)

        if(isSeguindo) {
            await User.findByIdAndUpdate(req.user._id, { $pull: {seguindo: id} });
            await User.findByIdAndUpdate(id, { $pull: {seguidores: req.user._id} });
            res.status(200).json({
                mensagem: "Usuário deixou de ser seguido com sucesso"
            })
            
        } else {
            await User.findByIdAndUpdate(id, { $push: {seguidores: req.user._id} });
            await User.findByIdAndUpdate(req.user._id, { $push: {seguindo: id} });
            
            const novaNotificacao = new Notificacao({
                tipo: "seguir",
                de: req.user._id,
                para: usuarioModificado._id
            })
            
            await novaNotificacao.save();
            res.status(200).json({
                mensagem: "Usuário seguido com sucesso"
            })
        }
        
    } catch (error) {
        console.log("Erro no controller seguirToggleUsuario:",error.message)
        res.status(500).json({
            erro: error.message
        })
    }
}

export const getUsuariosSugeridos = async (req, res) => {
    try {
        const userRequisicaoId = req.user._id;
        
        const usersSeguidosPorMim = await User.findById(userRequisicaoId).select('seguindo');
        
        const users = await User.aggregate([
            {
                $match: {
                    _id: { $ne: userRequisicaoId },
                }
            },
            { $sample: { size: 10 } },
        ]);

        const usersFiltrados = users.filter(user=>!usersSeguidosPorMim.seguindo.includes(user._id))
        const usersSugeridos = usersFiltrados.slice(0,4)

        usersSugeridos.forEach(user=>user.senha=null);

        res.status(200).json(usersSugeridos);

    } catch (error) {
        console.log("Erro no controller getUsuariosSugeridos:", error.message);
        res.status(500).json({ erro: error.message });
    }
};

export const atualizarPerfilUsuario = async (req, res) => {
    const {nome_completo, email, nome_usuario, senha, novaSenha, bio, link} = req.body;
    let { imagem_perfil, imagem_banner } = req.body;

    const userId = req.user._id;

    try {
        let user = await User.findById(userId)
        if(!user) {
            return res.status(404).json({
                erro: "Usuário não encontrado"
            })
        }

        if((!senha && novaSenha) || (senha && !novaSenha)) {
            return res.status(400).json({
                erro: "Você precisa fornecer a senha atual e a nova senha."
            })
        }

        if(senha && novaSenha) {
            const isIgual = await bcrypt.compare(senha, user.senha)
            if (!isIgual){
                return res.status(400).json({
                    erro: "Senha inválida"
                })
            }
            if(novaSenha.toString().length<6){
                return res.status(400).json({
                    erro: "A nova senha precisa ter no mínimo 6 caracteres."
                })
            }

            const salt = await bcrypt.genSalt(10);
            user.senha = await bcrypt.hash(novaSenha, salt);
        }

        if(imagem_perfil) {
            if(user.imagem_perfil) {
                await cloudinary.uploader.destroy(user.imagem_perfil.split('/').pop().split('.')[0])
            }
            const uploadResponse = await cloudinary.uploader.upload(imagem_perfil);
            imagem_perfil = uploadResponse.secure_url;
        }

        if(imagem_banner) {
            if(user.imagem_banner) {
                await cloudinary.uploader.destroy(user.imagem_banner.split('/').pop().split('.')[0])
            }
            const uploadResponse = await cloudinary.uploader.upload(imagem_banner);
            imagem_banner = uploadResponse.secure_url;
        }

        user.nome_completo = nome_completo || user.nome_completo;
        user.email = email || user.email;
        user.nome_usuario = nome_usuario || user.nome_usuario;
        user.bio = bio || user.bio;
        user.link = link || user.link;
        user.imagem_perfil = imagem_perfil || user.imagem_perfil;
        user.imagem_banner = imagem_banner || user.imagem_banner;

        user = await user.save();

        user.senha = null;

        return res.status(200).json(user);

    } catch (error) {
        console.log("Erro no controller atualizarPerfilUsuario:", error.message)
        res.status(400).json({
            erro: error.message
        })
    }
}