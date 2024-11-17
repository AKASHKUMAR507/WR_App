import axios from "axios";
const { useEffect, useState } = require("react")

const GetExchangeRate = async (from, podate) => {
    try {
        const response = await axios.get(`https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/${podate}/currencies/${from}.json`);
        const data = response.data;
        return data[from];
    } catch (error) {
        throw error;
    }
}

const ExchangeCurrencyFromUSD = async ({ from, to, amount, podate }) => {

    try {
        const exchangeRate = await GetExchangeRate(from.toLowerCase(), podate);
        const rate = exchangeRate[to.toLowerCase()];
        return (amount * rate).toFixed(2);
    } catch (error) {
        throw error;
    }
}

export { ExchangeCurrencyFromUSD }
