import React, { useState } from 'react';

interface RemoveLinesFormProps {
    onRemoveLines: (lines: number[]) => void;
}

const RemoveLinesForm: React.FC<RemoveLinesFormProps> = ({ onRemoveLines }) => {
    const [linesToRemove, setLinesToRemove] = useState<string>('');

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLinesToRemove(event.target.value);
    };

    const handleRemoveLines = () => {
        const linesArray = linesToRemove.split(',').map(line => parseInt(line.trim(), 10));
        onRemoveLines(linesArray);
    };

    return (
        <div>
            <input type="text" value={linesToRemove} onChange={handleInputChange} placeholder="Ingrese las líneas a eliminar (separadas por coma)" />
            <button onClick={handleRemoveLines}>Eliminar líneas</button>
        </div>
    );
};

export default RemoveLinesForm;
