import { Request, RequestContentType, ResponseEncodings } from '../network';

async function GetMessagesController(dealid: string) {
    const url = `user/mydeals/getmessage/${dealid}`;

    try {
        const response = await Request('GET', url);
        return response.data; 
    } 
    catch (error) {
        throw error; 
    };
}

async function SendMessageController(formData: FormData) {
    const url = `user/mydeals/sendmessage`;

    try {
        const response = await Request('POST', url, formData, false, ResponseEncodings.JSON, RequestContentType.FormData);
        return response.data;
    }
    catch (error) {
        throw error; 
    };
}

export { GetMessagesController, SendMessageController };