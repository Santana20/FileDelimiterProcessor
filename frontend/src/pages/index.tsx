import FileUploader from '@/components/file-uploader';
import FilesDownload from '@/components/files-download';
import RemoveLinesForm from '@/components/remove-lines-form';
import { removeLines, uploadFile } from '@/services/file-service';
import { useState } from 'react';
import { Toaster, toast } from 'sonner';

const Home = () => {
  const [fileUploaded, setFileUploaded] = useState<boolean>(false);
  const [filesToDownload, setFilesToDownload] = useState<boolean>(false);

  const handleFileUpload = async (file: File) => {
    const [error, _] = await uploadFile(file)

    if (error) {
      toast.error(error.message)
      return
    }

    setFileUploaded(true);
    toast.success('Archivo subido correctamente')
  };

  const handleRemoveLines = async (lines: number[]) => {
    const [error, success] = await removeLines(lines);

    if (error) {
      toast.error(error.message)
      return
    }

    if (success) {
      setFilesToDownload(true)
      toast.success('Operacion realizada correctamente')
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
        {filesToDownload && (<FilesDownload />)}
      </div>
    </>
  );
};

export default Home;
