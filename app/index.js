import express from 'express';
import fileRoutes from './routes/routes.js';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/file', fileRoutes);