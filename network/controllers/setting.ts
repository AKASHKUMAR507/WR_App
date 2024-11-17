import Chronos from '../../utilities/chronos';
import {Request, RequestContentType, ResponseEncodings} from '../network';
import { AttachmentsInterface } from '../network-utils';

interface AddPaymentDetailsInterface {
    paymentmethodid: number;
    accountnumber: number;
    accountname: string;
    bankname: string;
    accounttype?: string;
    swiftcode?: string;
    addressline1: string;
    addressline2: string;
    city: string;
    country: string;
    pin: number;
    ifsccode?: string;
}

interface CallScheduleInterface{
    scheduletime: string;
    scheduledate: string;
}

interface ChangeEmailInterface {
    confirmpassword: string;
    newemail: string;
    currentemail: string;
}

interface ResetPasswordInterface{
    currentpassword: string;
    newpassword: string;
    confirmnewpassword: string;
}

interface EmailAndMessagingInterface {
    tradealerts: string;
    hotproducts: string;
    buyerleads: string;
    tradeshows: string;
    webinars: string;
    userguides: string;
    training: string;
    dealupdates: string;
    approvalnotificaations: string;
    transactionnotificaations: string;
    newmessagenotificaations: string;
    systemalerts: string;
}

interface PrivacySettingsInterface {
    hideprofilesummary: string,
    hideoffervalue: string,
    hideaddress: string,
    hidebusinessexperience: string,
    hideemail: string,
    hidewebsite: string,
    hidecertifications: string,
    hidedealvalue: string,
    hideproducts: string,
    hidesocialprofilelinks: string,
    hidesubmittedoffers: string,
    hidemobile: string,
    hidecompany: string,
    hidesubmitteddeals: string,
    hideterritories: string,
    hideservices: string,
    hideindustries: string
}

interface RaiseaTicketInterface { subject: string, description: string, attachments: AttachmentsInterface[] }

async function AddPaymentDetailsController (params: AddPaymentDetailsInterface){
    const url = 'user/addpaymentdetails';
    try{
        const response = await Request('POST', url, params);
        return response;
    }catch(err){
        throw err;
    };
};

async function CallScheduleController(params: CallScheduleInterface) {
    const url = 'user/action/callschedule';
    try{
        const response = await Request('POST', url, params);
        return response;
    }catch (err) {throw err};
}


async function ChangeEmailController(params:ChangeEmailInterface) {
    const url = 'user/changeemail';
    try{
        const response = await Request('POST', url, params);
        return response;
    }catch(err){
        throw err;
    };
}

async function ResetPasswordController(params:ResetPasswordInterface) {
    const url = 'user/resetpassword';
    try{
        const response = await Request('POST', url, params);
        return response;
    }
    catch(err){
        throw err;
    };
};

async function EmailAndMessagingController(params:EmailAndMessagingInterface) {
    const url = 'user/action/emailandmessaging';
    try{
        const response = await Request('POST', url, params);
        return response;
    }catch(err){
        throw err;
    };
};

async function ViewPaymentDetails1Controller() {
    const url = 'user/viewpaymentdetails/1';
    try{
        const response = await Request('GET', url);
        return response;
    }catch(err){
        throw err;
    };
};

async function ViewPaymentDetails2Controller() {
    const url = 'user/viewpaymentdetails/2';
    try{
        const response = await Request('GET', url);
        return response;
    }catch(err){
        throw err;
    };
};

async function ViewTagsController() {
    const url = 'user/action/viewtags';
    try{
        const response = await Request('GET', url);
        return response;
    }
    catch(err){
        throw err;
    };
};

async function ViewPrivacySettingsController() {
    const url = 'user/action/viewprivacysettings';
    try{
        const response = await Request('GET', url);
        return response;
    }catch(err){
        throw err;
    };
};

async function VieweMailAndMessagingController() {
    const url = 'user/action/viewemailandmessaging';
    try{
        const response = await Request('GET', url);
        return response;
    }catch(err){
        throw err;
    };
};

async function RaiseaTicketController(formData: FormData) {
    const url = 'user/action/raiseaticket';
    try {
        const response = await Request('POST', url, formData, false, ResponseEncodings.JSON, RequestContentType.FormData)
        return response;
    } catch (error) {
        throw error;
    }
}

async function ViewAssociateTicketDetailController(ticketid: number) {
    const url = `user/action/viewassociateticketdetail/${ticketid}`
    try {
        const response = await Request('GET', url);
        return response;
    } catch (error) {
        throw error;
    }
}
async function ViewTicketsController() {
    const url = 'user/action/viewtickets';
    try{
        const response = await Request('GET', url);
        return response;
    }catch(err){
        throw err;
    };
};

async function GetAgreementTermsControllers() {
    const url = 'user/action/getagreementterms';
    try{
        const response = await Request('GET', url);
        return response;
    }catch(err){
        throw err;
    };
};


async function PrivacySettingsController(params: PrivacySettingsInterface) {
    const url = 'user/action/privacysettings';
    try {
        const response = await Request('POST', url, params);
        return response;
    } catch (err) {
        throw err;
    }
    
}


export type {
    AddPaymentDetailsInterface, CallScheduleInterface, ChangeEmailInterface, ResetPasswordInterface, EmailAndMessagingInterface, PrivacySettingsInterface, RaiseaTicketInterface
}
export {
    AddPaymentDetailsController, CallScheduleController, ChangeEmailController, ResetPasswordController, EmailAndMessagingController, ViewPaymentDetails1Controller, ViewPaymentDetails2Controller, ViewTagsController, ViewPrivacySettingsController, PrivacySettingsController, VieweMailAndMessagingController, ViewTicketsController, GetAgreementTermsControllers, RaiseaTicketController, ViewAssociateTicketDetailController
}