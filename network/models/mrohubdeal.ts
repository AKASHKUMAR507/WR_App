import { DocumentHubController, DraftDealListController, EscalateIssueController, EscalateIssueInterface, MroHubDealDetailsController, MroHubDealDetailsInterface, MroHubDealInterface, MroHubDealListController } from "../controllers/mrohubdeal";

async function MroHubDealList(params: MroHubDealInterface) {
    try {
        const response = await MroHubDealListController(params);
        return response;
    } catch (error) {
        throw error;
    }
}

async function MroHubDealDetails(params: MroHubDealDetailsInterface) {

    try {
        const response = await MroHubDealDetailsController(params);
        return response;
    } catch (error) {
        throw error;
    }
}

async function DraftDealList() {
    try {
        const response = await DraftDealListController();
        return response;
    } catch (error) {
        throw error;
    }
}

async function DocumentHub(dealid: string) {
    try {
        const response = await DocumentHubController(dealid);
        return response;
    } catch (error) {
        throw error;
    }
}

async function EscalateIssue(params: EscalateIssueInterface) {
    try {
        const formData = new FormData();
        formData.append('issue', JSON.stringify(params))
        const response = await EscalateIssueController(formData);
        return response;
    } catch (error) {
        throw error;
    }
}

export { MroHubDealList, MroHubDealDetails, DraftDealList, DocumentHub, EscalateIssue }