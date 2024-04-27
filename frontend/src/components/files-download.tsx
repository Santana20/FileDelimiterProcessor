import { getFilteredLinesUrl, getRemovedLinesUrl } from '@/services/file-service';
import React, { useState } from 'react';
import { toast } from 'sonner';

const FilesDownload: React.FC = () => {

    const handleDownloadFiles = async () => {
        const [filteredLinesError, filteredLinesUrl] = await getFilteredLinesUrl();
        const [removedLinesError, removedLinesUrl] = await getRemovedLinesUrl();

        if (filteredLinesError || removedLinesError) {
            toast.error('Error al obtener los enlaces de descarga de archivos');
            return;
        }


        // Alternativamente, si deseas descargar los archivos automáticamente sin abrir una nueva ventana, puedes usar esto:
        const filteredLinesAnchor = document.createElement('a');
        filteredLinesAnchor.href = filteredLinesUrl!;
        filteredLinesAnchor.download = 'file_filtered_lines.txt';
        filteredLinesAnchor.click();
        const removedLinesAnchor = document.createElement('a');
        removedLinesAnchor.href = removedLinesUrl!;
        removedLinesAnchor.download = 'file_removed_lines.txt';
        removedLinesAnchor.click();
    };

    return (
        <div>
            <button onClick={handleDownloadFiles}>Descargar archivos</button>
        </div>
    );
};

export default FilesDownload;
