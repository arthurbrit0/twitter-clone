import express from 'express';
import authRoutes from './routes/authRoutes.js';
import dotenv from 'dotenv';
import connectMongoDB from './db/connectMongoDB.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use("/api/auth", authRoutes)

app.listen(8000, () => {
    console.log(`Servidor rodando na porta ${PORT}!`)
    connectMongoDB();
})