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
        <div className='flex gap-4 justify-center'>
            <button className='bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded' onClick={downloadFilteredLines}>Descargar archivo con líneas filtradas</button>
            <button className='bg-transparent hover:bg-red-500 text-red-700 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded' onClick={downloadRemovedLines}>Descargar archivo con líneas eliminadas</button>
        </div>
    );
};

export default FilesDownload;
