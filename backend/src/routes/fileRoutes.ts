import express from 'express';
import multer from 'multer';
import { Readable } from 'stream';

const router = express.Router();
const upload = multer();

let memoryFile: Express.Multer.File | undefined = undefined;
let filteredFileBuffer: Buffer
let removedFileBuffer: Buffer

// Ruta para cargar archivos
router.post('/upload', upload.single('file'), (req, res) => {
    const { file: updloadFile } = req

    if (!updloadFile) {
        return res.status(400).send('No se ha proporcionado ningún archivo');
    }

    memoryFile = updloadFile

    // Devolver confirmación de carga exitosa
    res.status(200).send('Archivo cargado exitosamente');
});

// Ruta para eliminar líneas del archivo en memoria
router.post('/remove-rows', (req, res) => {
    if (!memoryFile) {
        return res.status(400).send('No se ha proporcionado ningún archivo. Cargue un archivo en /file/upload');
    }

    console.log(req.body)
    // Obtener el arreglo de filas a eliminar del cuerpo de la solicitud
    const rowsToRemove: number[] = req.body.rowsToRemove;
    if (!rowsToRemove || !Array.isArray(rowsToRemove)) {
        return res.status(400).send('Se espera un arreglo de filas a eliminar');
    }

    const fileBuffer = memoryFile.buffer;
    const fileContent = fileBuffer.toString('utf-8');
    const fileLines = fileContent.split('\n');

    // Separar las líneas en dos grupos: las que se mantendrán y las que se eliminarán
    const { filteredLines, removedLines } = fileLines.reduce((acc, line, index) => {
        if (rowsToRemove.includes(index + 1)) {
            acc.removedLines.push(line);
        } else {
            acc.filteredLines.push(`${acc.filteredLines.length + 1}|${line.split('|').slice(1).join('|')}`);
        }
        return acc;
    }, { filteredLines: [] as string[], removedLines: [] as string[] });

    // Unir las líneas de cada grupo en cadenas de texto
    const filteredContent = filteredLines.join('\n');
    const removedContent = removedLines.join('\n');

    // Crear archivos adjuntos con el contenido
    filteredFileBuffer = Buffer.from(filteredContent, 'utf-8');
    removedFileBuffer = Buffer.from(removedContent, 'utf-8');

    res.status(200).send('Se realizo las operaciones correctamente')
});

// Endpoint para descargar el archivo de líneas filtradas
router.get('/download-filtered-lines', (req, res) => {
    if (!filteredFileBuffer) {
        return res.status(404).send('No se encontró el archivo de líneas filtradas');
    }

    res.set('Content-Type', 'text/plain');
    res.attachment('file_filtered_lines.txt');
    res.send(filteredFileBuffer);
});

// Endpoint para descargar el archivo de líneas eliminadas
router.get('/download-removed-lines', (req, res) => {
    if (!removedFileBuffer) {
        return res.status(404).send('No se encontró el archivo de líneas eliminadas');
    }

    res.set('Content-Type', 'text/plain');
    res.attachment('file_removed_lines.txt');
    res.send(removedFileBuffer);
});


export default router;
