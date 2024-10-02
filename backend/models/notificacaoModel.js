import mongoose from 'mongoose';

const notificacaoSchema = mongoose.Schema({
    de: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    para: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    tipo: {
        type: String,
        required: true,
        enum: ['seguir', 'like'],
    },

    visto: {
        type: Boolean,
        default: false,
    }
}, {timestamps:true});

const Notificacao = mongoose.model("Notificacao", notificacaoSchema);

export default Notificacao