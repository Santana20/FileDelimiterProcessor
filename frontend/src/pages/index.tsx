import FileUploader from '@/components/file-uploader';
import FilesDownload from '@/components/files-download';
import RemoveLinesForm from '@/components/remove-lines-form';
import { removeLines, uploadFile } from '@/services/file-service';
import { useState } from 'react';
import { Toaster, toast } from 'sonner';

const Home = () => {
  const [fileUploaded, setFileUploaded] = useState<boolean>(false);
  const [filesToDownload, setFilesToDownload] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (file: File) => {
    // Simulamos la subida del archivo al servidor y la obtención de las URLs de descarga
    const [error, _] = await uploadFile(file)

    if (error) {
      toast.error(error.message)
      return
    }

    setFileUploaded(true);
    toast.success('Archivo subido correctamente')
  };

  const handleRemoveLines = async (lines: number[]) => {
    try {
      const [error, success] = await removeLines(lines);

      if (error) {
        toast.error(error.message)
        return
      }

      if (success) {
        setFilesToDownload(true)
        toast.success('Operacion realizada correctamente')
      }
    } catch (error) {
      console.error('Error al obtener los archivos adjuntos:', error);
    }

  };

  return (
    <>
      <Toaster></Toaster>
      <div>
        {!fileUploaded ? (
          <FileUploader onFileUpload={handleFileUpload} />
        ) : (
          <RemoveLinesForm onRemoveLines={handleRemoveLines} />
        )}
        {error && <p>{error}</p>}
        {filesToDownload && (<FilesDownload />)}
      </div>
    </>
  );
};

export default Home;
