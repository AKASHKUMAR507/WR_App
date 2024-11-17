import { Request } from "../network";

interface BuyerProductInterface{
    searchParams?: string
}

async function BuyerProductController(searchParams: BuyerProductInterface) {
    const url = `mrohub/buyer/product/my-products/${searchParams}`;
    try {
        const response = await Request('GET', url);
        return response.data; 
    }
    catch (error) {
        throw error;
    }
}

async function SystemListController(buyerId: number) {
    const url = `user/dealmanager/catalogue/get/system?buyerId=${buyerId}`;
    try {
        const response = await Request('GET', url);
        return response.data;
    } catch (error) {
        throw error;
    }
}
async function SubSystemListController(systemId: number) {
    const url = `user/dealmanager/catalogue/get/sub-system?systemId=${systemId}`;
    try {
        const response = await Request('GET', url);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export type { BuyerProductInterface }
export { BuyerProductController, SystemListController, SubSystemListController }