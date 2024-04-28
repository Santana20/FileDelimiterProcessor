import { FileResponse } from '@/types/types';
import { saveAs } from 'file-saver';
import React from 'react';

interface FileDownloadButtonsProps {
  filteredFileResponse: FileResponse | null;
  removedFileResponse: FileResponse | null;
}

const FilesDownload: React.FC<FileDownloadButtonsProps> = (
  { filteredFileResponse, removedFileResponse }: FileDownloadButtonsProps
) => {
  function saveContentAsFile(content: string, filename: string) {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, filename);
  }

  function handleDownloadFilteredContent() {
    if (!filteredFileResponse) {
      return
    }
    saveContentAsFile(filteredFileResponse.content, filteredFileResponse.name);
  }

  function handleDownloadRemovedContent() {

    if (!removedFileResponse) {
      return
    }
    saveContentAsFile(removedFileResponse.content, removedFileResponse.name);
  }

  return (
    <div className='flex gap-4 justify-center'>
      <button className='bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded' onClick={handleDownloadFilteredContent}>Descargar archivo con líneas filtradas</button>
      <button className='bg-transparent hover:bg-red-500 text-red-700 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded' onClick={handleDownloadRemovedContent}>Descargar archivo con líneas eliminadas</button>
    </div>
  );
};

export default FilesDownload;
