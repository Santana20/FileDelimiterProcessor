import { FileResponse } from "@/types/types";

export function getFileNameAndExtension(nombreArchivo: string) {
    const parts = nombreArchivo.split('.');
    const filename = parts.slice(0, -1).join('.');
    const extension = parts.slice(-1)[0];

    return {
        filename,
        extension
    };
}

function getFileLines(file: File): Promise<string[]> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (event) => {
            const content = event.target?.result as string;
            const lines = content.split('\n');
            resolve(lines);
        };

        reader.onerror = (event) => {
            reject(new Error('Error reading file: ' + (event.target?.error as any)?.message));
        };

        reader.readAsText(file);
    });
}

type RemoveLinesData = {
    filteredFileResponse: FileResponse,
    removedFileResponse: FileResponse
}

export const removeLinesV1 = async (uploadFile: File, rowsToRemove: number[], delimiter: string = '|'): Promise<[Error?, RemoveLinesData?]> => {

    try {

        const fileLines = await getFileLines(uploadFile)

        // Separar las líneas en dos grupos: las que se mantendrán y las que se eliminarán
        const { filteredLines, removedLines } = fileLines.reduce((acc: {
            removedLines: string[],
            filteredLines: string[],
        }, line: string, index: number) => {
            if (rowsToRemove.includes(index + 1)) {
                acc.removedLines.push(line);
            } else {
                acc.filteredLines.push(`${acc.filteredLines.length + 1}${delimiter}${line.split(delimiter).slice(1).join(delimiter)}`);
            }
            return acc;
        }, { filteredLines: [] as string[], removedLines: [] as string[] });

        // Unir las líneas de cada grupo en cadenas de texto
        const filteredContent = filteredLines.join('\n');
        const removedContent = removedLines.join('\n');

        const { filename, extension } = getFileNameAndExtension(uploadFile.name)

        const response = {
            filteredFileResponse: {
                name: `${filename}_filtered.${extension}`,
                content: filteredContent
            },
            removedFileResponse: {
                name: `${filename}_removed.${extension}`,
                content: removedContent
            },
        }

        return [undefined, response]
    } catch (error) {
        console.error(error);
        if (error instanceof Error) return [error]
    }

    return [new Error('Unknow error')]
}