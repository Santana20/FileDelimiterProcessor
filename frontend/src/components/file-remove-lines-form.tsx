import { getFileNameAndExtension } from '@/services/file-service';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

interface FileRemoveLinesFormProps {
  onSubmitForm: (file: File, rowsToRemove: number[], delimiter: string) => void;
}

const FileRemoveLinesForm: React.FC<FileRemoveLinesFormProps> = ({ onSubmitForm }) => {
  const [file, setFile] = useState<File | null>(null);
  const [linesToRemove, setLinesToRemove] = useState<string>('');
  const [delimiter, setDelimiter] = useState<string>('|')

  const [errorInput, setErrorInput] = useState<string>('');

  const inputRef = useRef<HTMLInputElement>(null);

  // UseEffect para enfocar el input cuando se renderice el componente
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleOnBlurInput = (event: React.FocusEvent<HTMLInputElement>) => {
    const input = event.target.value;

    if (input == '') {
      setErrorInput('Campo requerido')
      return
    }

    // Expresión regular para validar que solo haya números, comas y espacios en blanco
    const validCharactersRegex = /^[0-9,]+$/;

    // Expresión regular para validar que no comience ni termine con una coma
    const notStartingOrEndingWithCommaRegex = /^(?!.*,$)(?!.*,$).*/;

    // Expresión regular para validar números duplicados
    const hasDuplicates = (input: string): boolean => {
      const numbers = input.split(',');
      return new Set(numbers).size !== numbers.length;
    };

    if (
      !validCharactersRegex.test(input)
    ) {
      setErrorInput('Solo numeros y comas')
      return
    }

    if (
      !notStartingOrEndingWithCommaRegex.test(input)
    ) {
      setErrorInput("No puede iniciar ni terminar con coma.")
      return
    }

    const numbers = input.split(',').map(Number);
    for (const number of numbers) {
      if (!Number.isInteger(number) || number <= 0) {
        setErrorInput('Numero entero y mayor a 0')
        return
      }
    }

    if (hasDuplicates(input)) {
      setErrorInput('Hay numeros duplicados')
      return
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    setLinesToRemove(inputValue);

    if (errorInput) setErrorInput('')
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files && event.target.files[0];

    if (!selectedFile) {
      setFile(null);
      toast.info('No se seleccionó ningún archivo');
      return;
    }

    const { filename, extension } = getFileNameAndExtension(selectedFile.name)

    if (extension !== 'txt') {
      setFile(null);
      toast.error('El archivo debe tener la extensión .txt');
      return;
    }

    setFile(selectedFile);
  };


  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const linesArray = linesToRemove.split(',').map(line => parseInt(line.trim(), 10));

    if (file) {
      onSubmitForm(file, linesArray, delimiter);
    } else {
      toast.error('No hay archivo para subir')
    }
  };

  return (
    <form onSubmit={handleSubmit} className='p-10 flex flex-col gap-7'>
      <label htmlFor="fileInput" className="block text-blue-600 rounded cursor-pointer hover:opacity-80">
        <input
          id="fileInput"
          type="file"
          className="hidden"
          onChange={handleFileChange}
          ref={inputRef}
          accept=".txt"
        />
        <div className="flex items-center justify-center border border-dashed border-gray-300 rounded py-2">
          {file ? file.name : 'Click para subir archivo'}
        </div>
      </label>

      <div>
        <input
          id="lines-to-remove"
          type="text"
          value={linesToRemove}
          onChange={handleInputChange}
          onBlur={handleOnBlurInput}
          placeholder="lineas a eliminar (separadas por coma)"
          className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
        />
        {
          errorInput && (
            <p className="text-red-500 text-xs italic">{errorInput}</p>
          )
        }
      </div>

      <button
        type="submit"
        disabled={!!errorInput} className={`bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border ${errorInput ? 'opacity-50 cursor-not-allowed' : 'border-blue-500'} hover:border-transparent rounded`}
      >
        Remove Lines
      </button>


    </form>
  );
};

export default FileRemoveLinesForm;
