import { Request } from "../network";


async function HpBuyingSellingDealController() {
    const url = 'user/hpbuyingsellingdeals';
    try{
        const response = await Request('GET', url);
        return response;
    } catch(err) {throw err}
}

async function EarningsController() {
    const url = 'deal/earnings';
    try{
        const response = await Request('GET', url);
        return response;
    } catch(err) {throw err}
}

async function BuyerSearchController() {
    const url = 'buyer/search';
    try{
        const response = await Request('GET', url);
        return response;
    } catch(err) {throw err}
}

async function SellerSearchController() {
    const url = 'seller/search';
    try{
        const response = await Request('GET', url);
        return response;
    } catch(err) {throw err}
}

async function ViewKeyInfoController() {
    const url = 'user/viewkeyinfo';
    try{
        const response = await Request('GET', url);
        return response;
    } catch(err) {throw err}
}



export {HpBuyingSellingDealController, EarningsController, BuyerSearchController, SellerSearchController, ViewKeyInfoController}