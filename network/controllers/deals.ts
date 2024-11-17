import { Request, RequestContentType, ResponseEncodings } from '../network';
import { AttachmentsInterface } from '../network-utils';

interface ListDealsInterface { roletype: string, dealstatus: string }
interface DealDetailsInterface { dealid: string, role: string, rfqid?: string }
interface ReferSellerInterface { dealid: string, rfqid: string, sellerid: string }
interface PoUploadInterface { poid: any, dealid: string, sellerid: string, poamount: number, ponumber: string, quoteid: string, uploadfileid: string, originalfile: string, podate: string, paymentCurrency: string, attachments: AttachmentsInterface[] }
interface AddInvoiceInterface { dealid: string, sellerid: string, invoiceamount: number, invoicedate: string, invoicenumber: string, uploadfileid: string, paymentCurrency: string, attachments: AttachmentsInterface[] }

async function CreateDealController(formData: FormData) {
    const url = `deal/upload`;

    try {
        const response = await Request('POST', url, formData, false, ResponseEncodings.JSON, RequestContentType.FormData);
        return response.data;
    }
    catch (error) {
        throw error; 
    };
}

async function CreateQuotationController(formData: FormData) {
    const url = `deal/quote/upload`;

    try {
        const response = await Request('POST', url, formData, false, ResponseEncodings.JSON, RequestContentType.FormData);
        return response.data;
    }
    catch (error) {
        throw error;
    };
}

async function ListSellingDealsController(params: ListDealsInterface) {
    const url = `user/mydeals/sellingdeals?roletype=${params.roletype}&dealstatus=${params.dealstatus}`;

    try {
        const response = await Request('GET', url);
        return response.data; 
    } 
    catch (error) {
        throw error; 
    };
}

async function ListBuyingDealsController(params: ListDealsInterface) {
    const url = `user/mydeals/buyingdeals?roletype=${params.roletype}&dealstatus=${params.dealstatus}`;

    try {
        const response = await Request('GET', url);
        return response.data; 
    }
    catch (error) {
        throw error;
    }
}

async function DealDetailsController(params: DealDetailsInterface) {
    const url = `user/mydeals/dealinfo/${params.dealid}?role=${params.role}&rfqid=${params.rfqid}`;

    try {
        const response = await Request('GET', url);
        return response.data; 
    }
    catch (error) {
        throw error;
    }
}

async function DealPaymentsController(dealid: string) {
    const url = `user/mydeals/dealtracking/payment/${dealid}`;

    try {
        const response = await Request('GET', url);
        return response.data; 
    }
    catch (error) {
        throw error;
    }
}

async function ReferSellerController(params: ReferSellerInterface) {
    const url = `deal/rfq/referseller`;

    try {
        const response = await Request('POST', url, params);
        return response.data; 
    }
    catch (error) {
        throw error;
    }
}

async function PoUploadController(formData: FormData) {
    const url = `buyer/deal/po/upload`;

    try {
        const response = await Request('POST', url, formData, false, ResponseEncodings.JSON, RequestContentType.FormData);
        return response.data;
    } catch (error) {
        throw error;
    }
}

async function CreatePurchaseOrderController(formDate: FormData) {
    const url = `deal/po/upload`;

    try {
        const response = await Request('POST', url, formDate, false, ResponseEncodings.JSON, RequestContentType.FormData);
        return response.data;
    }
    catch (error) {
        throw error;
    };
}

async function AddInvoiceController(formData: FormData) {
    const url = `deal/invoice/upload`;

    try {
        const response = await Request('POST', url, formData, false, ResponseEncodings.JSON, RequestContentType.FormData);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export type { ListDealsInterface, DealDetailsInterface, ReferSellerInterface, PoUploadInterface, AddInvoiceInterface };
export { CreateDealController, CreateQuotationController, ListSellingDealsController, ListBuyingDealsController, DealDetailsController, DealPaymentsController, ReferSellerController, PoUploadController, AddInvoiceController, CreatePurchaseOrderController };