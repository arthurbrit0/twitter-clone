import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    nome_usuario : {
        type: String,
        required: true,
        unique: true,
    },

    nome_completo : {
        type: String,
        required: true,
    },

    senha : {
        type: String,
        required: true,
        minLength: 6,
    },

    email : {
        type: String,
        required: true,
        unique: true,
    },

    seguidores : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: []
        }
    ],

    seguindo : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: []
        }
    ],

    imagem_perfil : {
        type: String,
        default: "",
    },

    imagem_banner : {
        type: String,
        default: "",
    },

    bio : {
        type: String,
        default: "",
    },

    link: {
        type: String,
        default: "",
    },

},{timestamps: true})

const User = mongoose.model("User", userSchema);

export default User;