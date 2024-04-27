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
            toast.info('Archivo no se encuentra para subirlo')
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="fileInput">Subir Archivo:</label>
            <input
                type="file"
                id="fileInput"
                accept=".txt,.csv"
                onChange={handleFileChange}
            />
            {file && <p>Archivo seleccionado: {file.name}</p>}
            <button type="submit">Upload file</button>
        </form>
    );
};

export default FileUploader;
