
const BASE_URL = 'http://localhost:4000'

export const uploadFile = async (
    file: File,
): Promise<[Error?, boolean?]> => {
    if (!file) {
        return [new Error('No existe archivo a subir')]
    }

    const formData = new FormData();

    formData.append('file', file);

    try {
        const response = await fetch(`${BASE_URL}/file/upload`, {
            body: formData,
            method: 'POST',
        })

        if (!response.ok) {
            return [new Error(`Error on response: ${response.statusText}`)]
        }

        return [undefined, true]
    } catch (error) {
        if (error instanceof Error) return [error]
    }

    return [new Error('Unknow error')]
}

export const removeLines = async (
    rowsToRemove: number[],
): Promise<[Error?, boolean?]> => {

    try {
        const response = await fetch(`${BASE_URL}/file/remove-rows`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({
                rowsToRemove
            })
        })

        if (!response.ok) {
            return [new Error(`Error on response: ${response.statusText}`)]
        }

        return [undefined, true];

    } catch (error) {
        if (error instanceof Error) return [error]
    }

    return [new Error('Unknow error')]
}

export const getFilteredLines = async (): Promise<[Error?, Blob?]> => {
    try {
        const response = await fetch(`${BASE_URL}/file/download-filtered-lines`);
        if (!response.ok) {
            throw new Error(`Error al obtener la URL del archivo de líneas filtradas: ${response.statusText}`);
        }
        const blob = await response.blob();
        return [undefined, blob];
    } catch (error) {
        console.error(error);
        if (error instanceof Error) return [error]
    }

    return [new Error('Unknow error')]
};

export const getRemovedLines = async (): Promise<[Error?, Blob?]> => {
    try {
        const response = await fetch(`${BASE_URL}/file/download-removed-lines`);
        if (!response.ok) {
            throw new Error(`Error al obtener la URL del archivo de líneas eliminadas: ${response.statusText}`);
        }
        const blob = await response.blob();
        return [undefined, blob];
    } catch (error) {
        console.error(error);
        if (error instanceof Error) return [error]
    }

    return [new Error('Unknow error')]
};
