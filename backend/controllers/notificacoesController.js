import Notificacao from "../models/notificacaoModel.js"

export const getNotificacoes = async (req, res) => {
    try {
        const userId = req.user._id
        const notificacoesDoUsuario = await Notificacao.find({ para: userId }).populate({
            path: 'de',
            select: 'nome_usuario imagem_perfil'
        })

        await Notificacao.updateMany({para:userId}, {visto: true});

        res.status(200).json(notificacoesDoUsuario)

    } catch (error) {
        console.log("Erro no controller getNotificacoes:",error.message)
        res.status(500).json({
            erro: "Erro interno do servidor"
        })
        
    }
}

export const deletarNotificacoes = async (req, res) => {
    try {
        const userId = req.user._id;

        await Notificacao.deleteMany({para: userId})

        res.status(200).json({
            mensagem: "Notificações deletadas com sucesso!"
        })

    } catch (error) {
        console.log("Erro no controller deletarNotificacoes:", error.message)
        res.status(500).json({
            erro: "Erro interno do servidor"
        })
    }
}
