import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import { gerarTokenESetarCookie } from '../lib/utils/gerarToken.js';

export const fazerCadastro = async (req, res) => {
    try {
        const {nome_completo, nome_usuario, email, senha} = req.body;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ erro: "Formato de email inválido" });
        }

        const usuarioExistente = await User.findOne({nome_usuario: nome_usuario});
        if (usuarioExistente) {
            return res.status(400).json({ erro: "Usuario já está sendo utilizado"})
        }

        const emailExistente = await User.findOne({email: email});
        if (emailExistente) {
            return res.status(400).json({ erro: "Email já está sendo utilizado"})
        }

        if(senha.toString().length < 6) {
            return res.status(400).json({
                erro: "Senha deve ter mais de 6 caracteres."
            })
        }

        const salt = await bcrypt.genSalt(10);
        const senhaHash = await bcrypt.hash(senha.toString(), salt);

        const novoUser = new User({
            nome_completo: nome_completo,
            nome_usuario: nome_usuario,
            email: email,
            senha: senhaHash,
        })

        if(novoUser) {
            gerarTokenESetarCookie(novoUser._id, res)
            await novoUser.save();

            res.status(201).json({
                _id: novoUser._id,
                nome_completo: novoUser.nome_completo,
                nome_usuario: novoUser.nome_usuario,
                email: novoUser.email,
                seguidores: novoUser.seguidores,
                seguindo: novoUser.seguindo,
                imagem_perfil: novoUser.imagem_perfil,
                imagem_banner: novoUser.imagem_banner,
                bio: novoUser.bio,
                link: novoUser.link,
            })

        } else {
            return(400).json({erro: "Dados inválidos"})
        }

    } catch (error) {
        console.log("Erro no controller de cadastro:", error.message)
        res.status(500).json({erro: "Erro interno do servidor"})
    }
}

export const fazerLogin = async (req, res) => {
    try {
        const { nome_usuario, senha } = req.body;
        const user = await User.findOne({nome_usuario});
        const validarSenha = await bcrypt.compare(senha, user?.senha || '')

        if(!user || !validarSenha) {
            return res.status(400).json({
                erro: "Nome de usuário ou senha inválidos."
            })
        }

        gerarTokenESetarCookie(user._id, res);

        res.status(200).json({
            _id: user._id,
            nome_completo: user.nome_completo,
            nome_usuario: user.nome_usuario,
            email: user.email,
            seguidores: user.seguidores,
            seguindo: user.seguindo,
            imagem_perfil: user.imagem_perfil,
            imagem_banner: user.imagem_banner,
            bio: user.bio,
            link: user.link,
            posts_curtidos: user.posts_curtidos,
        })

    } catch (error) {
        console.log("Erro no controller de login:", error.message)
        res.status(500).json({
            erro: "Erro interno do servidor"
        })
        
    }
}

export const fazerLogout = async (req, res) => {
    try {
        res.cookie("jwt","",{
            maxAge:0
        })
        res.status(200).json({
            mensagem: "Logout feito com sucesso"
        })
    } catch (error) {
        console.log("Erro no controller de logout:", error.message)
        res.status(500).json({
            erro: "Erro interno do servidor"
        })
        
    }
}

export const getMe = async(req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-senha");
        res.status(200).json(user);
    } catch (error) {
        console.log("Erro no controller getMe:", error.message);
        res.status(500).json({
            erro: "Erro interno do servidor"
        })
        
    }
}