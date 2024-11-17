import GetCountriesAndCitiesController from "../controllers/getcountriesandcities";

async function GetCountriesAndCities() {
    try{
        const response = await GetCountriesAndCitiesController();
        return response.data;
    } catch(err) {throw err}
}

export default GetCountriesAndCities;