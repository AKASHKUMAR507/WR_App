import { Request } from "../network";

async function ListPurchaseOrdersController() {
    const url = `buyer/order/list`;

    try {
        const response = await Request('GET', url);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

async function PurchaseOrderDetailsController(orderid: string) {
    const url = `buyer/order/details/${orderid}`;

    try {
        const response = await Request('GET', url);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

export { ListPurchaseOrdersController, PurchaseOrderDetailsController };