import express from 'express';
import cors from 'cors';
import fileRoutes from './routes/fileRoutes';

const app = express();
const port = 4000;

// Aplicar CORS
app.use(cors());
// Middleware para analizar el cuerpo de la solicitud como JSON
app.use(express.json());

// Usar las rutas de fileRoutes
app.use('/file', fileRoutes);

app.get('/', (req, res) => {
    return res.status(200).send("server is running")
})

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
