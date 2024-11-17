import Chronos from "../../utilities/chronos";
import { ContactType, CreateContactController, GetBuyerDealsController, GetBuyersListController, GetSellerDealsController, GetSellersListController, SellerForPOController } from "../controllers/contacts";
import { AppendFilesToFormData, AttachmentsInterface } from "../network-utils";

interface CreateContactInterface { type: ContactType, name: string, mailid: string, countrycode: string, phoneno: string, addressline1?: string, addressline2?: string, city?: string, country: string, pincode?: string, compname: string, companywebsite?: string, department?: string, designation?: string, attachments: AttachmentsInterface[] }
type ContactRequest = { buyername?: string, sellername?: string, mailid: string, countrycode: string, phoneno: string, addressline1?: string, addressline2?: string, city?: string, country: string, pincode?: string, compname: string, companywebsite?: string, department?: string, designation?: string }

async function CreateContact(params: CreateContactInterface) {
    try {
        const contactObject: ContactRequest = {
            mailid: params.mailid,
            countrycode: params.countrycode,
            phoneno: params.phoneno,
            country: params.country,
            compname: params.compname
        };

        params.addressline1 && (contactObject.addressline1 = params.addressline1);
        params.addressline2 && (contactObject.addressline2 = params.addressline2);
        params.city && (contactObject.city = params.city);
        params.pincode && (contactObject.pincode = params.pincode);
        params.companywebsite && (contactObject.companywebsite = params.companywebsite);
        params.department && (contactObject.department = params.department);
        params.designation && (contactObject.designation = params.designation);
    
        params.type === ContactType.Buyer ? contactObject.buyername = params.name : contactObject.sellername = params.name;
    
        const formData = new FormData();
        formData.append(params.type, JSON.stringify(contactObject));
        AppendFilesToFormData(formData, params.attachments);
    
        const response = await CreateContactController(formData, params.type);
        return response;
    }
    catch (error) {
        throw error;
    }
}

async function GetBuyersList() {
    try {
        const response = await GetBuyersListController();
        const sortedResponse = Chronos.SortObjectsByDate(response);
        return sortedResponse;
    }
    catch (error) {
        throw error;
    }
}

async function GetSellersList() {
    try {
        const response = await GetSellersListController();
        const sortedResponse = Chronos.SortObjectsByDate(response);
        return sortedResponse;
    }
    catch (error) {
        throw error;
    }
}

async function SellerForPO(dealid: string) {
    try {
        const response = await SellerForPOController(dealid);
        return response;
    } catch (error) {
        throw error;
    }
}

async function GetBuyerDeals(buyerid: string) {
    try {
        const response = await GetBuyerDealsController(buyerid);
        const sortedResponse = Chronos.SortObjectsByDate(response);
        return sortedResponse;
    }
    catch (error) {
        throw error;
    }
}

async function GetSellerDeals(sellerid: string) {
    try {
        const response = await GetSellerDealsController(sellerid);
        const sortedResponse = Chronos.SortObjectsByDate(response);
        return sortedResponse;
    }
    catch (error) {
        throw error;
    }
}

export { CreateContact, GetBuyersList, GetSellersList, GetBuyerDeals, GetSellerDeals, SellerForPO }