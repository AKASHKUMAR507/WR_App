import { Request } from "../network";

async function GetCountriesAndCitiesController() {
    const url = 'https://countriesnow.space/api/v0.1/countries';
    try{
        const response = await Request('GET', url);
        return response.data;
    } catch(err) {throw err}
}

export default GetCountriesAndCitiesController;