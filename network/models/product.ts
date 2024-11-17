import { BuyerProductController, BuyerProductInterface, SubSystemListController, SystemListController } from "../controllers/product";

async function BuyerProductDetails(searchParams: BuyerProductInterface) {
    try {
        const response = await BuyerProductController(searchParams);
        return response;
    }
    catch (error) {
        throw error;
    }
}

async function SystemList(buyerId: number) {
    try {
        const response = await SystemListController(buyerId);
        return response;
    } catch (error) {
        throw error;
    }
}

async function SubSystemList(systemId: number) {

    try {
        const response = await SubSystemListController(systemId);
        return response;
    } catch (error) {
        throw error;
    }
}

export { BuyerProductDetails, SystemList, SubSystemList }