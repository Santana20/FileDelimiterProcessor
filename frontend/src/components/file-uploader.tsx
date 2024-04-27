import React, { useState } from 'react';
import { toast } from 'sonner';

interface FileUploaderProps {
  onFileUpload: (file: File) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileUpload }) => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files && event.target.files[0];
    setFile(selectedFile);
    if (!selectedFile) {
      toast.info('No selecciono ningun archivo')
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (file) {
      onFileUpload(file);
    } else {
      toast.error('No hay archivo para subir')
    }
  };

  return (
    <form onSubmit={handleSubmit} className='p-10 flex flex-col gap-7'>
      <input
        type="file"
        id="fileInput"
        accept=".txt,.csv"
        onChange={handleFileChange}
      />
      <button type="submit" className='bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded'>Upload file</button>
    </form>
  );
};

export default FileUploader;
