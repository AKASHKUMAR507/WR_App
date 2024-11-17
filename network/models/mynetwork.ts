import { AddTemplateInterface,  AddTemplatesController} from "../controllers/mynetwork";
import { SendTemplateMailInterface, SendTemplateMailController } from "../controllers/mynetwork";
import { ViewTemplateController } from "../controllers/mynetwork";


async function AddTemplate(params:AddTemplateInterface) {
    try{
        const response = await AddTemplatesController(params);
        return response;
    }catch(err){
        throw err;
    };
};

async function SendTemplateMail(params:SendTemplateMailInterface) {
    try{
        const response = await SendTemplateMailController(params);
        return response;
    }catch(err){
        throw err;
    };
};

async function ViewTemplate() {
    try{
        const response = await ViewTemplateController();
        return response;
    }catch(err){
        throw err;
    };
};

export {AddTemplate, SendTemplateMail, ViewTemplate}


