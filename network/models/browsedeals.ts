import Chronos from "../../utilities/chronos";
import { AddLiveDealToBuyingController, AddLiveDealsInterface, ListLiveDealsController, LiveDealDetailsController } from "../controllers/browsedeals";

async function ListLiveDeals() {
    try {
        const response = await ListLiveDealsController();
        
        const sortedResponse = Chronos.SortObjectsByDate(response);
        return sortedResponse;
    }
    catch (error) {
        throw error;
    };
}

async function LiveDealDetails(dealid: string) {
    try {
        const response = await LiveDealDetailsController(dealid);
        return response;
    }
    catch (error) {
        throw error;
    }
}

async function AddLiveDealToBuying(params: AddLiveDealsInterface) {
    try {
        const response = await AddLiveDealToBuyingController(params);
        return response;
    }
    catch (error) {
        throw error;
    }
}

export { ListLiveDeals, LiveDealDetails, AddLiveDealToBuying }