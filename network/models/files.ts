import { DownloadFileController } from "../controllers/files";
import RNFS from 'react-native-fs';

async function DownloadFile(fileid: string, filename: string, params?: string) {
    try {
        const response = await DownloadFileController(fileid, params);
        if (!response || response.length === 0) {
            throw new Error(`${filename} returned no data.`);
        }

        const path = `${RNFS.CachesDirectoryPath}/${filename}`;
        await RNFS.writeFile(path, response, 'base64');

        const file = await RNFS.stat(path);
        if (file.size === 0) {
            throw new Error(`${filename} could not be saved.`);
        }

        return { path: file.path, size: file.size };
    }
    catch (error) {
        throw new Error(`Could not download file ${filename}`);
    }
}

export { DownloadFile }