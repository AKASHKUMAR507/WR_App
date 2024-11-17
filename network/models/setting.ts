
import { AddPaymentDetailsInterface, AddPaymentDetailsController, PrivacySettingsController, PrivacySettingsInterface, RaiseaTicketInterface, RaiseaTicketController, ViewAssociateTicketDetailController } from "../controllers/setting";
import { CallScheduleInterface, CallScheduleController } from "../controllers/setting";
import { ChangeEmailInterface, ChangeEmailController} from "../controllers/setting";
import { ResetPasswordInterface, ResetPasswordController } from "../controllers/setting";
import { EmailAndMessagingInterface, EmailAndMessagingController } from "../controllers/setting";
import { ViewPaymentDetails1Controller } from "../controllers/setting";
import { ViewPaymentDetails2Controller } from "../controllers/setting";
import { ViewTagsController } from "../controllers/setting";
import { ViewPrivacySettingsController } from "../controllers/setting";
import { VieweMailAndMessagingController } from "../controllers/setting";
import { ViewTicketsController } from "../controllers/setting";
import { GetAgreementTermsControllers } from "../controllers/setting";
import { AppendFilesToFormData } from "../network-utils";
import Chronos from "../../utilities/chronos";


async function AddPaymentDetails(params:AddPaymentDetailsInterface) {
    try{
        const response = await AddPaymentDetailsController(params);
        return response;
    }catch(err){
        throw err;
    };
};


async function CallSchedule(params:CallScheduleInterface) {
    try{
        const response = await CallScheduleController(params);
        return response;
    }catch(err){
        throw err;
    };   
};


async function ChangeEmail(params:ChangeEmailInterface) {
    try{
        const response = await ChangeEmailController(params);
        return response;
    }catch(err){
        throw err;
    };   
};

async function ResetPassword(params:ResetPasswordInterface) {
    try{
        const response = await ResetPasswordController(params);
        return response;
    }catch(err){
        throw err;
    };
};

async function ViewPaymentDetails1() {
    try{
        const response = await ViewPaymentDetails1Controller();
        return response;
    }catch(err){
        throw err;
    };
};

async function ViewPaymentDetails2() {
    try{
        const response = await ViewPaymentDetails2Controller();
        return response;
    }catch(err){
        throw err;
    };
};

async function ViewTags() {
    try{
        const response = await ViewTagsController();
        return response;
    }catch(err){
        throw err;
    };
};

async function ViewPrivacySettings() {
    try{
        const response = await ViewPrivacySettingsController();
        return response;
    }catch(err){
        throw err;
    }
}

async function PrivacySetting(params: PrivacySettingsInterface) {
    try {
        const response = await PrivacySettingsController(params);
        return response;
    } catch (error) {
        throw error;
    }
}

async function VieweMailAndMessaging() {
    try{
        const response = await VieweMailAndMessagingController();
        return response;
    }catch(err){
        throw err;
    }
}

async function EmailAndMessaging(params: EmailAndMessagingInterface) {
    try {
        const response = await EmailAndMessagingController(params);
        return response;
    } catch (error) {
        throw error
    }
}

async function RaiseaTicket(params: RaiseaTicketInterface) {
    try {
        const RaiseaTicketObject = {
            subject: params.subject,
            description: params.description,
        }

        const formData = new FormData();
        formData.append('ticket', JSON.stringify(RaiseaTicketObject));
        AppendFilesToFormData(formData, params.attachments);

        const response = await RaiseaTicketController(formData);
        return response;
    } catch (error) {
        throw error;
    }
}

async function ViewAssociateTicketDetail(ticketid: number) {
    try {
        const response = ViewAssociateTicketDetailController(ticketid);
        return response;
    } catch (error) {
        throw error;
    }
}

async function ViewTickets() {
    try{
        const response = await ViewTicketsController();
        return response;
    }catch(err){
        throw err;
    }
}

async function GetAgreementTerms() {
    try{
        const response = await GetAgreementTermsControllers();
        return response;
    }catch(err){
        throw err;
    }
}

export {AddPaymentDetails, CallSchedule, ChangeEmail, ResetPassword, ViewPaymentDetails1, ViewPaymentDetails2, ViewTags, ViewPrivacySettings, PrivacySetting, VieweMailAndMessaging,EmailAndMessaging, ViewTickets, GetAgreementTerms, RaiseaTicket, ViewAssociateTicketDetail}