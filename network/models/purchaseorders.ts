import Chronos from "../../utilities/chronos";
import { ListPurchaseOrdersController, PurchaseOrderDetailsController } from "../controllers/purchaseorders";

async function ListPurchaseOrders() {
    try {
        const response = await ListPurchaseOrdersController();
        return Chronos.SortObjectsByDate(response.object, 'modifieddate' || 'createddate');
    }
    catch (error) {
        throw error;
    }
}

async function PurchaseOrderDetails(orderid: string) {
    try {
        const response = await PurchaseOrderDetailsController(orderid);
        return response;
    }
    catch (error) {
        throw error;
    }
}

export { ListPurchaseOrders, PurchaseOrderDetails };