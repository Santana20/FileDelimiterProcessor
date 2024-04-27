import { getFilteredLines, getRemovedLines } from '@/services/file-service';
import { saveAs } from 'file-saver';
import React from 'react';
import { toast } from 'sonner';

const FilesDownload: React.FC = () => {
    const downloadFilteredLines = async () => {
        const [filteredLinesError, filteredLinesBlob] = await getFilteredLines();

        if (filteredLinesError) {
            toast.error('Error al obtener los enlaces de descarga de archivos');
            return;
        }

        if (filteredLinesBlob) {
            saveAs(filteredLinesBlob, 'file_filtered_lines.txt');
        }
    };

    const downloadRemovedLines = async () => {
        const [removedLinesError, removedLinesBlob] = await getRemovedLines();

        if (removedLinesError) {
            toast.error('Error al obtener los enlaces de descarga de archivos');
            return;
        }

        if (removedLinesBlob) {
            saveAs(removedLinesBlob, 'file_removed_lines.txt');
        }
    };

    return (
        <div>
            <button onClick={downloadFilteredLines}>Descargar archivo con líneas filtradas</button>
            <button onClick={downloadRemovedLines}>Descargar archivo con líneas eliminadas</button>
        </div>
    );
};

export default FilesDownload;
