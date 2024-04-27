import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

interface RemoveLinesFormProps {
  onRemoveLines: (lines: number[]) => void;
}

const RemoveLinesForm: React.FC<RemoveLinesFormProps> = ({ onRemoveLines }) => {
  const [linesToRemove, setLinesToRemove] = useState<string>('');
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


  const handleRemoveLines = () => {
    const linesArray = linesToRemove.split(',').map(line => parseInt(line.trim(), 10));
    onRemoveLines(linesArray);
  };

  return (
    <div className='p-10 flex flex-col gap-7'>
      <div>
        <input ref={inputRef} id="lines-to-remove" type="text" value={linesToRemove} onChange={handleInputChange} onBlur={handleOnBlurInput} placeholder="lineas a eliminar (separadas por coma)" className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' />
        {
          errorInput && (
            <p className="text-red-500 text-xs italic">{errorInput}</p>
          )
        }
      </div>
      <button onClick={handleRemoveLines} disabled={!!errorInput} className={`bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border ${errorInput ? 'opacity-50 cursor-not-allowed' : 'border-blue-500'
        } hover:border-transparent rounded`}>Eliminar líneas</button>
    </div>
  );
};

export default RemoveLinesForm;
