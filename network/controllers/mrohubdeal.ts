import { Request, RequestContentType, ResponseEncodings } from "../network";

interface MroHubDealInterface { dealstatus: string; pagenum: string; elements: string; }
interface MroHubDealDetailsInterface { dealid: string; draft: boolean }
interface EscalateIssueInterface { desc: string}

async function MroHubDealListController(params: MroHubDealInterface) {
    const url = `mrohub/buyer/deal/all?dealStatus=${params.dealstatus}&pagenum=${params.pagenum}&elements=${params.elements}`;

    try {
        const response = await Request('GET', url);
        return response.data;
    } catch (error) {
        throw error;
    }
}

async function MroHubDealDetailsController(params: MroHubDealDetailsInterface) {
    const url = `mrohub/buyer/deal/detail/${params.dealid}?draft=${params.draft}`;

    try {
        const response = await Request('GET', url);
        return response.data;
    } catch (error) {
        throw error;
    }
}

async function DraftDealListController() {
    const url = `mrohub/buyer/deal/draft-deals`;
    try {
        const response = await Request('GET', url);
        return response.data;
    } catch (error) {
        throw error;
    }
}

async function DocumentHubController(dealid: string) {
    const url = `user/dealmanager/deal/document?dealId=${dealid}`;
    try {
        const response = await Request('GET', url);
        return response.data;
    } catch (error) {
        throw error;
    }
}

async function UploadDocInDocumentController() {
    const url = `user/dealmanager/deal/document?dealId=${""}&role=${""}`;
    try {
        const response = await Request('POST', url);
        return response.data;
    } catch (error) {
        throw error;
    }
}

async function DeleteDocFromDocumentHubController(dealid: string, id: string) {
    const url = `user/dealmanager/deal/document?dealId=${dealid}&id=${id}`;
    try {
        const response = await Request('GET', url);
        return response.data;
    } catch (error) {
        throw error;
    }
}

async function EscalateIssueController(formData: FormData) {
    const url = 'buyer/escalateissue';
    try {
        const response = Request('POST', url, formData, false, ResponseEncodings.JSON, RequestContentType.FormData);
        return response;
    } catch (error) {
        throw error;
    }
}

export type { MroHubDealInterface, MroHubDealDetailsInterface, EscalateIssueInterface }
export { MroHubDealListController, MroHubDealDetailsController, DraftDealListController, DocumentHubController, UploadDocInDocumentController, DeleteDocFromDocumentHubController, EscalateIssueController }