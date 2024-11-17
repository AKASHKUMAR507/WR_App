import { HpBuyingSellingDealController} from "../controllers/explore";
import { EarningsController } from "../controllers/explore";
import { BuyerSearchController } from "../controllers/explore";
import { SellerSearchController } from "../controllers/explore";
import { ViewKeyInfoController } from "../controllers/explore";

async function HpBuyingSellingDeal() {
    try{
        const response = await HpBuyingSellingDealController();
        return response;
    } catch(err) {throw err}
}
async function Earnings() {
    try{
        const response = await EarningsController();
        return response;
    } catch(err) {throw err}
}
async function BuyerSearch() {
    try{
        const response = await BuyerSearchController();
        return response;
    } catch(err) {throw err}
}
async function SellerSearch() {
    try{
        const response = await SellerSearchController();
        return response;
    } catch(err) {throw err}
}
async function ViewKeyInfo() {
    try{
        const response = await ViewKeyInfoController();
        return response;
    } catch(err) {throw err}
}
 
export {HpBuyingSellingDeal, Earnings, BuyerSearch, SellerSearch, ViewKeyInfo};