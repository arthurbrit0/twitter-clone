import User from "../models/userModel.js";
import jwt from 'jsonwebtoken';

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if(!token) {
            return res.status(401).json({
                erro: "Não autorizado: você não possui um token"
            })
        }

        const payload = jwt.verify(token, process.env.JWT_SECRET);
        if(!payload) {
            return res.status(401).json({
                erro: "Não autorizado: token inválido"
            })
        }

        const user = await User.findById(payload.userId).select("-senha");

        if(!user) {
            return res.status(404).json({
                erro: "Usuário não foi encontrado"
            })
        }

        req.user = user;
        next();

    } catch (error) {
        console.log("Erro no middleware protectRoute:", error.message)
        return res.status(500).json({
            erro: "Erro interno do servidor"
        })
    }
}