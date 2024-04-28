import express from 'express';
import archiver from 'archiver';

const router = express.Router();

function getFileNameAndExtension(nombreArchivo: string) {
    const parts = nombreArchivo.split('.');
    const filename = parts.slice(0, -1).join('.');
    const extension = parts.slice(-1)[0];

    return {
        filename,
        extension
    };
}

type File = {
    originalname: string;
    buffer: string;
};


// Ruta para eliminar líneas del archivo en memoria
router.post('/remove-rows', (req, res) => {

    console.log(req.body)

    // Obtener datos del body
    const uploadFile: File = req.body.uploadFile
    const rowsToRemove: number[] = req.body.rowsToRemove;
    const delimiter: string = req.body.delimiter || '|';

    if (!rowsToRemove || !Array.isArray(rowsToRemove)) {
        return res.status(400).send('Se espera un arreglo de filas a eliminar');
    }
    const fileContent = uploadFile.buffer
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
