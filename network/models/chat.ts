import { GetMessagesController, SendMessageController } from "../controllers/chat";
import { AppendFilesToFormData, AttachmentsInterface } from "../network-utils";

interface SendMessageInterface { dealid: string, chatid: string, receiverid: string, roletype: string, message: string, attachments: AttachmentsInterface[] }

async function GetMessages(dealid: string) {
    try {
        const response = await GetMessagesController(dealid);
        return response;
    }
    catch (error) {
        throw error;
    }
}

async function SendMessage(params: SendMessageInterface) {
    try {
        const messageObject = {
            dealid: params.dealid,
            receiverid: params.receiverid,
            type: params.roletype.toUpperCase(),
            chatId: params.chatid,
            messages: params.message
        }

        const formData = new FormData();
        formData.append('message', JSON.stringify(messageObject));
        AppendFilesToFormData(formData, params.attachments);

        const response = await SendMessageController(formData);
        return response;
    }
    catch (error) {
        throw error;
    }
}

export { GetMessages, SendMessage }