import { Request, RequestContentType, ResponseEncodings } from '../network';

enum ContactType {
    Buyer = 'buyer',
    Seller = 'seller'
}

async function CreateContactController(formData: FormData, contactType: ContactType) {
    const url = `${contactType}/add`;

    try {
        const response = await Request('POST', url, formData, false, ResponseEncodings.JSON, RequestContentType.FormData);
        return response.data;
    }
    catch (error) {
        throw error;
    };
}

async function GetBuyersListController() {
    const url = `buyer/search`;

    try {
        const response = await Request('GET', url);
        return response.data; 
    } 
    catch (error) {
        throw error; 
    };
}

async function GetSellersListController() {
    const url = `seller/search`;

    try {
        const response = await Request('GET', url);
        return response.data; 
    } 
    catch (error) {
        throw error; 
    };
}

async function SellerForPOController(dealid: string) {
    const url = `deal/po/searchsellersforPO/${dealid}`;

    try {
        const response = await Request( 'GET' , url );
        return response;
    } catch (error) {
        throw error;
    }
}

async function GetBuyerDealsController(buyerid: string) {
    const url = `buyer/linkeddeals`;

    try {
        const response = await Request('POST', url, { buyerid });
        return response.data; 
    } 
    catch (error) {
        throw error; 
    };
}

async function GetSellerDealsController(sellerid: string) {
    const url = `seller/linkeddeals`;

    try {
        const response = await Request('POST', url, { sellerid });
        return response.data; 
    }
    catch (error) {
        throw error;
    }
}

export { ContactType, CreateContactController, GetBuyersListController, GetSellersListController, GetBuyerDealsController, GetSellerDealsController, SellerForPOController };