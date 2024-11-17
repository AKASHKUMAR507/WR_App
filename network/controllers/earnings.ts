import { Request } from '../network';

interface ListEarningsInterface { dealtype: string, claimstatus: string }

async function GetEarningsOverviewController() {
    const url = `deal/earnings`;

    try {
        const response = await Request('GET', url);
        return response.data; 
    } 
    catch (error) {
        throw error; 
    };
}

async function ListEarningsController(params: ListEarningsInterface) {
    const url = `deal/successfees?role=${params.dealtype}&type=${params.claimstatus}`;

    try {
        const response = await Request('GET', url);
        return response.data; 
    } 
    catch (error) {
        throw error; 
    };
}

export type { ListEarningsInterface };
export { GetEarningsOverviewController, ListEarningsController };