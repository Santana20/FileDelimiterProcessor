import cors from 'cors';
import express from 'express';
import fileRoutes from './routes/fileRoutes';

const app = express();
const port = process.env.PORT || 4000;

// Aplicar CORS
app.use(cors());

// Middleware para analizar el cuerpo de la solicitud como JSON
app.use(express.json());

// Usar las rutas de fileRoutes
app.use('/file', fileRoutes);

app.get('/', (req, res) => {
    return res.status(200).send("server is running")
})

app.post('/', (req, res) => {
    console.log(req.body)
    return res.status(200).send(req.body)
})

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app
