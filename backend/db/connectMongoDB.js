import mongoose, { connect } from 'mongoose';

const connectMongoDB = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGO_URI)
        console.log(`MongoDB conectado: ${connection.connection.host}`)
    } catch (error) {
        console.error(`Erro ao se conectar com o banco de dados: ${error.message}`)
        process.exit(1);
    }
}

export default connectMongoDB;