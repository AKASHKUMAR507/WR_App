import Chronos from "../../utilities/chronos";
import { CreateDealController, CreatePurchaseOrderController, CreateQuotationController, DealDetailsController, DealDetailsInterface, DealPaymentsController, ListBuyingDealsController, PoUploadController, PoUploadInterface, ReferSellerController, ReferSellerInterface } from "../controllers/deals";
import { ListSellingDealsController } from "../controllers/deals";
import { AppendFilesToFormData, AttachmentsInterface, FormatDate } from "../network-utils";
import { AddInvoiceController, AddInvoiceInterface } from "../controllers/deals";

interface DealRoles { ACTIVE: boolean, PASSIVE: boolean }
interface DealStatus { SUBMITTED: boolean, LIVE: boolean, QUOTED: boolean, PO_RELEASED: boolean, INVOICED: boolean, PARTIALLY_PAID: boolean, FULLY_PAID: boolean, DELIVERED: boolean, REJECTED: boolean, LOST: boolean, SUSPENDED: boolean }

interface DealFilterInterface { roletype: DealRoles, dealstatus: DealStatus }

interface CreateDealInterface { buyerid: string, closingdate: Date, dealname: string, description: string, deliveryplace: string, deliverycity: string, deliveryterms: string, roletype: string, attachments: AttachmentsInterface[] }

interface PaymentTerms { percentage: number, terms: string }
interface CreateQuotationInterface { dealid: string, rfqid: string, sellerid: string, deliveryterms: string, paymentterms: PaymentTerms[], offervalue: string, currency: string, offervalidity: Date, warrantydesc: string, sellerofferreferencenumber: string, sellerquotationdate: Date, destinationcountry: string, destinationcity: string, attachments: AttachmentsInterface[] }

interface CreatePurchaseOrderInterface { dealid: string, sellerid: string, poamount: string, ponumber: string, quoteid: string, paymentCurrency: string, attachments: AttachmentsInterface[] }

function DealRoleTypesFromObject(params: DealRoles) {
    let roleTypes = "";

    if (params.ACTIVE) roleTypes += "active,"
    if (params.PASSIVE) roleTypes += "passive,"

    return roleTypes.slice(0, -1);
}

function DealStatusTypesFromObject(params: DealStatus) {
    let statusTypes = "";

    if (params.SUBMITTED) statusTypes += "SUBMITTED,"
    if (params.LIVE) statusTypes += "LIVE,"
    if (params.QUOTED) statusTypes += "QUOTED,"
    if (params.PO_RELEASED) statusTypes += "PO_RELEASED,"
    if (params.INVOICED) statusTypes += "INVOICED,"
    if (params.PARTIALLY_PAID) statusTypes += "PARTIALLY_PAID,"
    if (params.FULLY_PAID) statusTypes += "FULLY_PAID,"
    if (params.DELIVERED) statusTypes += "DELIVERED,"
    if (params.REJECTED) statusTypes += "REJECTED,"
    if (params.LOST) statusTypes += "LOST,"
    if (params.SUSPENDED) statusTypes += "SUSPENDED,"

    return statusTypes.slice(0, -1);
}

function DealRoleTypeFromString(role: string) {
    if (role.toLowerCase() === "active") return "A";
    if (role.toLowerCase() === "passive") return "P";

    return "";
}

const FormattedDateWithYearMonthDay = (timestamps: string) => {
    const date = new Date(timestamps);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;

    return formattedDate;
}

async function CreateDeal(params: CreateDealInterface) {
    try {
        const dealObject = {
            buyerid: params.buyerid,
            closingdate: FormatDate(params.closingdate),
            dealname: params.dealname,
            dealtype: 'Selling',
            desc: params.description,
            deliveryplace: params.deliveryplace,
            deliverycity: params.deliverycity,
            deliveryterms: params.deliveryterms,
            roletype: DealRoleTypeFromString(params.roletype),
        }

        const formData = new FormData();
        formData.append('deal', JSON.stringify(dealObject));
        AppendFilesToFormData(formData, params.attachments);

        const response = await CreateDealController(formData);
        return response;
    }
    catch (error) {
        throw error;
    }
}

async function CreateQuotation(params: CreateQuotationInterface) {
    try {
        const paymentTerms = params.paymentterms.map((paymentTerm) => {
            return { percent: paymentTerm.percentage, description: paymentTerm.terms }
        });

        const quotationObject = {
            dealid: params.dealid,
            rfqid: params.rfqid,
            sellerid: params.sellerid,
            deliveryterms: params.deliveryterms,
            paymentterms: paymentTerms,
            offervalue: params.offervalue,
            offervalidity: FormatDate(params.offervalidity),
            warrantydesc: params.warrantydesc || '',
            sellerofferreferencenumber: params.sellerofferreferencenumber,
            sellerquotationdate: FormatDate(params.sellerquotationdate),
            destinationcountry: params.destinationcountry,
            destinationcity: params.destinationcity,
            currency: params.currency,
        }

        const formData = new FormData();
        formData.append('quote', JSON.stringify(quotationObject));
        AppendFilesToFormData(formData, params.attachments);

        const response = await CreateQuotationController(formData);
        return response;
    }
    catch (error) {
        throw error;
    }
}

async function ListSellingDeals(params: DealFilterInterface) {
    try {
        const ListDealsParams = { roletype: "", dealstatus: "" };

        ListDealsParams.roletype = DealRoleTypesFromObject(params.roletype);
        ListDealsParams.dealstatus = DealStatusTypesFromObject(params.dealstatus);

        const response = await ListSellingDealsController(ListDealsParams);
        const sortedResponse = Chronos.SortObjectsByDate(response);
        return sortedResponse;
    }
    catch (error) {
        throw error;
    };
}

async function ListBuyingDeals(params: DealFilterInterface) {
    try {
        const ListDealsParams = { roletype: "", dealstatus: "" };

        ListDealsParams.roletype = DealRoleTypesFromObject(params.roletype);
        ListDealsParams.dealstatus = DealStatusTypesFromObject(params.dealstatus);

        const response = await ListBuyingDealsController(ListDealsParams);

        const rfqsMappedToDeals: any[] = [];

        response.forEach((deal: any) => {
            deal.bdrfqs.forEach((rfq: any) => {
                const rfqMappedToDeal = { ...deal };

                rfqMappedToDeal.dealname = rfq.name;
                rfqMappedToDeal.description = rfq.description;
                rfqMappedToDeal.rfqid = rfq.id;
                rfqMappedToDeal.createddate = rfq.assignmentdate || rfq.createddate;
                rfqMappedToDeal.dealstatus = rfq.status;

                rfqsMappedToDeals.push(rfqMappedToDeal);
            });
        });

        const sortedResponse = Chronos.SortObjectsByDate(rfqsMappedToDeals);
        return sortedResponse;
    }
    catch (error) {
        throw error;
    };
}

async function DealDetails(params: DealDetailsInterface) {
    try {
        const response = await DealDetailsController(params);
        return response;
    }
    catch (error) {
        throw error;
    }
}

async function DealPayments(dealid: string) {
    try {
        const response = await DealPaymentsController(dealid);
        return response;
    }
    catch (error) {
        throw error;
    }
}

async function ReferSeller(params: ReferSellerInterface) {
    try {
        const response = await ReferSellerController(params);
        return response;
    }
    catch (error) {
        throw error;
    }
}

async function PoUpload(params: PoUploadInterface) {
    try {
        const PO_Object = {
            poid: null,
            dealid: params.dealid,
            sellerid: params.sellerid,
            poamount: params.poamount,
            ponumber: params.ponumber,
            quoteid: params.quoteid,
            paymentCurrency: params.paymentCurrency,
            podate: params.podate,
            uploadfileid: '',
            originalfile: ''
        }

        const formData = new FormData();

        formData.append('po', JSON.stringify(PO_Object));
        AppendFilesToFormData(formData, params.attachments);

        const response = await PoUploadController(formData);
        return response;
    } catch (error) {
        throw error;
    }
}

async function CreatePurchaseOrder(params: CreatePurchaseOrderInterface) {
    try {
        const purchaseOrderObject = {
            dealid: params.dealid,
            sellerid: params.sellerid,
            poamount: params.poamount,
            ponumber: params.ponumber,
            quoteid: params.quoteid,
            paymentCurrency: params.paymentCurrency,
            podate: FormatDate(new Date()),
        }

        const formData = new FormData();
        formData.append('po', JSON.stringify(purchaseOrderObject));
        AppendFilesToFormData(formData, params.attachments);

        const response = await CreatePurchaseOrderController(formData);
        return response;
    }
    catch (error) {
        throw error;
    }
}

async function AddInvoice(params: AddInvoiceInterface) {
    try {
        const InvoiceObject = {
            dealid: params.dealid,
            sellerid: params.sellerid,
            invoiceamount: params.invoiceamount,
            invoicedate: FormattedDateWithYearMonthDay(params.invoicedate),
            invoicenumber: params.invoicenumber,
            uploadfileid: "",
            paymentCurrency: params.paymentCurrency
        }

        const formData = new FormData();

        formData.append('invoice', JSON.stringify(InvoiceObject));
        AppendFilesToFormData(formData, params.attachments);

        const response = await AddInvoiceController(formData);
        return response;
    } catch (error) {
        throw error;
    }
}

export { CreateDeal, CreateQuotation, ListSellingDeals, ListBuyingDeals, DealDetails, DealPayments, ReferSeller, PoUpload, AddInvoice, FormattedDateWithYearMonthDay, CreatePurchaseOrder }
