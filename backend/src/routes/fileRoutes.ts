import express from 'express';
import multer from 'multer';
import archiver from 'archiver';

const router = express.Router();
const upload = multer();

function getFileNameAndExtension(nombreArchivo: string) {
    const parts = nombreArchivo.split('.');
    const filename = parts.slice(0, -1).join('.');
    const extension = parts.slice(-1)[0];

    return {
        filename,
        extension
    };
}

router.post('/subir-archivo', upload.single('archivo'), (req, res) => {
    // Acceder al archivo subido
    const archivo = req.file;

    // Acceder a los datos en formato JSON del body
    const datosJSON = req.body;

    // Hacer lo que necesites con el archivo y los datos JSON
    console.log('Archivo recibido:', archivo);
    console.log('Datos JSON recibidos:', datosJSON);

    // Enviar una respuesta
    res.send('Archivo y datos recibidos correctamente');
});

// Ruta para eliminar líneas del archivo en memoria
router.post('/remove-rows', upload.single('file'), (req, res) => {

    const { file: uploadFile } = req

    if (!uploadFile) {
        return res.status(400).send('No se ha proporcionado ningún archivo');
    }

    console.log(req.body.body)

    const bodyParse = JSON.parse(req.body.body);
    console.log(bodyParse)

    // Obtener el arreglo de filas a eliminar y el delimiter del cuerpo de la solicitud
    const rowsToRemove: number[] = bodyParse.rowsToRemove;
    const delimiter: string = bodyParse.delimiter || '|';

    if (!rowsToRemove || !Array.isArray(rowsToRemove)) {
        return res.status(400).send('Se espera un arreglo de filas a eliminar');
    }

    const fileBuffer = uploadFile.buffer;
    const fileContent = fileBuffer.toString('utf-8');
    const fileLines = fileContent.split('\n');

    // Separar las líneas en dos grupos: las que se mantendrán y las que se eliminarán
    const { filteredLines, removedLines } = fileLines.reduce((acc, line, index) => {
        if (rowsToRemove.includes(index + 1)) {
            acc.removedLines.push(line);
        } else {
            acc.filteredLines.push(`${acc.filteredLines.length + 1}${delimiter}${line.split(delimiter).slice(1).join(delimiter)}`);
        }
        return acc;
    }, { filteredLines: [] as string[], removedLines: [] as string[] });

    // Unir las líneas de cada grupo en cadenas de texto
    const filteredContent = filteredLines.join('\n');
    const removedContent = removedLines.join('\n');

    // Obtenemos el nombre y extension del archivo
    const { filename, extension } = getFileNameAndExtension(uploadFile.originalname)

    // Establecer encabezados para indicar que se enviarán archivos
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}_compress.zip"`);

    // Crear un archivo ZIP
    const archivoZip = archiver('zip', { zlib: { level: 9 } });

    // Transmitir el archivo ZIP al cliente
    archivoZip.pipe(res);

    // Añadir el contenido filtrado al archivo ZIP
    archivoZip.append(filteredContent, { name: `${filename}_filtered.${extension}` });

    // Añadir el contenido removido al archivo ZIP
    archivoZip.append(removedContent, { name: `${filename}_removed.${extension}` });

    // Finalizar el archivo ZIP
    archivoZip.finalize();
});

export default router;
