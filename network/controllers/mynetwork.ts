import { Request } from "../network";

interface AddTemplateInterface { 
    templatename: string; 
    templatetext: string; 
    templatetype: string;
}
interface SendTemplateMailInterface {
    templatename: string;
    templatetext: string;
    templatetype: string;
    senttoemailid: string;
}

async function AddTemplatesController(params:AddTemplateInterface) {
    const url = 'user/action/addtemplates';
    try{
        const response = await Request('POST', url , params);
        return response;
    }catch(err) {
        throw err;
    };
}

async function SendTemplateMailController(params:SendTemplateMailInterface) {
    const url = 'user/action/sendtemplatemail';
    try{
        const response = await Request('POST', url, params);
        return response;
    }catch(err) {
        throw err;
    };
}

async function ViewTemplateController() {
    const url = 'user/action/viewtemplates';
    try{
        const response = await Request('GET', url);
        return response;
    } catch(err) {
        throw err;
    };
}


export type {AddTemplateInterface, SendTemplateMailInterface}
export {AddTemplatesController, SendTemplateMailController, ViewTemplateController};