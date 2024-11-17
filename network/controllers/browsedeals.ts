import { Request } from '../network';

interface AddLiveDealsInterface { rfqtosellerid: string, userrefid: string }

async function ListLiveDealsController() {
    const url = `rfq/listallrfqs`;

    try {
        const response = await Request('GET', url);
        return response.data; 
    } 
    catch (error) {
        throw error; 
    };
}

async function LiveDealDetailsController(rfqid: string) {
    const url = `rfq/rfqdetail/${rfqid}`;

    try {
        const response = await Request('GET', url);
        return response.data; 
    }
    catch (error) {
        throw error;
    }
}

async function AddLiveDealToBuyingController(params: AddLiveDealsInterface) {
    const url = `rfq/assignrfq`;

    try {
        const response = await Request('POST', url, params);
        return response.data; 
    }
    catch (error) {
        throw error;
    }
}

export type { AddLiveDealsInterface };
export { ListLiveDealsController, LiveDealDetailsController, AddLiveDealToBuyingController };