import Chronos from "../../utilities/chronos";
import { GetEarningsOverviewController, ListEarningsController } from "../controllers/earnings";

interface EarningRoles { BUYING: boolean, SELLING: boolean }
interface EarningClaimStatus { SUCCESS_FEE_PAID: boolean, SUCCESS_FEE_NOT_PAID: boolean, ELIGIBLE_FOR_CLAIM: boolean, NOT_ELIGIBLE_FOR_CLAIM: boolean, CLAIM_UNDER_PROCESS: boolean }

interface EarningFilterInterface { dealtype: EarningRoles, claimstatus: EarningClaimStatus }

function EarningRoleTypesFromObject(params: EarningRoles) {
    let roleTypes = "";

    if (params.BUYING) roleTypes += "buying,"
    if (params.SELLING) roleTypes += "selling,"

    return roleTypes.slice(0, -1);
}

function EarningClaimTypesFromObject(params: EarningClaimStatus) {
    let statusTypes = "";

    if (params.SUCCESS_FEE_PAID) statusTypes += "sfpaid,"
    if (params.SUCCESS_FEE_NOT_PAID) statusTypes += "sfnotpaid,"
    if (params.ELIGIBLE_FOR_CLAIM) statusTypes += "eforclaim,"
    if (params.NOT_ELIGIBLE_FOR_CLAIM) statusTypes += "neforclaim,"
    if (params.CLAIM_UNDER_PROCESS) statusTypes += "claimunderprocess,"

    return statusTypes.slice(0, -1);
}

async function ListEarnings(params: EarningFilterInterface) {
    try {
        const ListDealsParams = { dealtype: "", claimstatus: "" };

        ListDealsParams.dealtype = EarningRoleTypesFromObject(params.dealtype);
        ListDealsParams.claimstatus = EarningClaimTypesFromObject(params.claimstatus);

        const response = await ListEarningsController(ListDealsParams);
        const sortedResponse = Chronos.SortObjectsByDate(response);

        return sortedResponse;
    }
    catch (error) {
        throw error;
    };
}

async function GetEarningsOverview() {
    try {
        const response = await GetEarningsOverviewController();
        return response;
    }
    catch (error) {
        throw error;
    }
}

export { GetEarningsOverview, ListEarnings }