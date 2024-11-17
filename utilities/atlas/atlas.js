import CountryFlagMappings from "./atlas-countryflags";
import CountryCitiesData from "./atlas-countrycity";
import CountryDialCodesMapping from "./atlas-countrydialcodes";
import CurrenciesData from "./atlas-currencies";

function CountryFlagEmoji(country) {
    try {
        const shortCode = CountryFlagMappings[country.trim()]; 
        return String.fromCodePoint(...[...shortCode.toUpperCase()].map(x=>0x1f1a5+x.charCodeAt(0)));
    }
    catch (error) {
        return '🌐';
    }
}

function GetCountries() {
    return Object.keys(CountryCitiesData);
}

function GetCountriesWithFlags() {
    const countries = Object.keys(CountryCitiesData);

    const countriesWithFlags = countries.map(country => {
        return {
            label: `${CountryFlagEmoji(country)} ${country}`,
            value: country
        }
    });

    return countriesWithFlags;
}

function GetCitiesByCountry(country) {
    return CountryCitiesData[country];
}

function GetCountryDialCodes() {
    return CountryDialCodesMapping;
}

function GetDialCodesByCountry(country) {
    return CountryDialCodesMapping[country];
}

function GetCountryByDialCode(dialCode) {
    const countries = GetCountries();
    const country = countries.find(country => CountryDialCodesMapping[country] === dialCode);
    return country;
}

function GetCurrencies() {
    return Object.keys(CurrenciesData);
}

function GetCurrenciesArray() {
    const currencies = GetCurrencies();

    const currenciesArray = Object.keys(currencies).map(currency => {
        return {
            label: `${currency} (${currencies[currency]})`,
            value: currencies[currency]
        }
    });

    return currenciesArray;
}

function GetCurrencyCodeByName(name) {
    return CurrenciesData[name];
}

function GetCurrencyNameByCode(code) {
    const currencies = GetCurrencies();
    const currency = currencies.find(currency => CurrenciesData[currency] === code);
    return currency;
}

export { CountryFlagEmoji, GetCountries, GetCountriesWithFlags, GetCitiesByCountry, GetCountryDialCodes, GetDialCodesByCountry, GetCountryByDialCode, GetCurrencies, GetCurrenciesArray, GetCurrencyCodeByName, GetCurrencyNameByCode };