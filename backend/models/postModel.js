import mongoose from 'mongoose';

const postSchema = mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    texto: {
        type: String,
    },
    imagem: {
        type: String,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],

    comentarios: [
        {
            texto: {
                type: String,
                required: true,
            },
            user: {
                type: mongoose.Schema.Types.ObjectId,
                required:true,
                ref:'User'
            },
        }
    ]
}, {timestamps: true});

const Post = mongoose.model('Post', postSchema);

export default Post;