import { Request, ResponseEncodings } from '../network';

function Base64FromBlob(data: Blob) {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(data);

    return new Promise((resolve, reject) => {
        fileReader.onload = () => resolve(fileReader.result);
        fileReader.onerror = (error) => reject(error);
    });
}

async function DownloadFileController(fileid: string, params?: string) {
    let url = `download/file?fileName=${fileid}`;

    if (params) { url += `&module=${params}`; }

    try {
        const response = await Request('POST', url, {}, true, ResponseEncodings.Stream);

        const base64Data = await Base64FromBlob(response.data);

        const base64DataString = base64Data as string;
        return base64DataString.split(',')[1];
    }
    catch (error) {
        throw error;
    }
}

export { DownloadFileController };