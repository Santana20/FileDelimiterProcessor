import express from 'express';
import multer from 'multer';
import { Readable } from 'stream';

const router = express.Router();
const upload = multer();

let memoryFile: Express.Multer.File | undefined = undefined;

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

    // Crear flujos de lectura para los archivos con las líneas quitadas y las líneas que se quitaron
    const fsFilteredContent = new Readable();
    fsFilteredContent.push(filteredContent);
    fsFilteredContent.push(null);

    const fsRemovedContent = new Readable();
    fsRemovedContent.push(removedContent);
    fsRemovedContent.push(null);

    // Enviar respuesta con dos archivos adjuntos
    res.set('Content-Type', 'multipart/mixed');
    res.attachment('file_filtered_lines.txt');
    res.attachment('file_removed_lines.txt');
    res.write(`--${Date.now()}\r\n`);
    res.write(`Content-Disposition: attachment; filename="file_filtered_lines.txt"\r\n\r\n`);
    res.write(filteredContent);
    res.write(`\r\n--${Date.now()}\r\n`);
    res.write(`Content-Disposition: attachment; filename="file_removed_lines.txt"\r\n\r\n`);
    res.write(removedContent);
    res.write(`\r\n--${Date.now()}--`);
    res.end();

});

export default router;
