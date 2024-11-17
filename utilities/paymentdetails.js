import { useState } from "react";
import { ExchangeCurrencyFromUSD } from "./currency";

const DealTypes = {
    Buying: 'Buying',
    Selling: 'Selling',
}

const Roles = {
    Active: 'A',
    Passive: 'P',
}

function GetMonthNumber(monthName) {
    switch (monthName.toLowerCase()) {
        case 'january':
            return '01';
        case 'february':
            return '02';
        case 'march':
            return '03';
        case 'april':
            return '04';
        case 'may':
            return '05';
        case 'june':
            return '06';
        case 'july':
            return '07';
        case 'august':
            return '08';
        case 'september':
            return '09';
        case 'october':
            return '10';
        case 'november':
            return '11';
        case 'december':
            return '12';
        default:
            return '';
    }
}

function FormatedDate(date) {
    const splitedDate = date.split(' ');
    const day = splitedDate[0].length === 1 ? `0${splitedDate[0]}` : splitedDate[0];
    const month = GetMonthNumber(splitedDate[1]);
    const year = splitedDate[2];

    return `${year}-${month}-${day}`;
}


async function PaymentDealInfoForSeller({ paymentInfo, dealType, role }) {
    const poDate = paymentInfo.bpodate;
    const from = paymentInfo.bpocurrency.toLowerCase();
    const to = 'usd';

    const totalDealValue = paymentInfo.totaldealvalue;
    const buyerPoCurrency = paymentInfo.bpocurrency;

    let dealProfitInUSD;

    if (!(buyerPoCurrency.toLowerCase() === "usd")) {
        dealProfitInUSD = await ExchangeCurrencyFromUSD({ from: from, to: to, amount: paymentInfo.dealprofit, podate: FormatedDate(poDate) })
    } else {
        dealProfitInUSD = paymentInfo.dealprofit;
    }

    return {
        dealProfitInUSD,
    }
}

async function PaymentDealInfoForBuyer({paymentInfo, dealType, role}){
    const poDate = paymentInfo.bpodate;
    const from = paymentInfo.bpocurrency.toLowerCase();
    const to = 'usd';

    const buyerPoCurrency = paymentInfo.bpocurrency;

    let dealProfitInUSD;

    if (!(buyerPoCurrency.toLowerCase() === "usd")) {
        dealProfitInUSD = await ExchangeCurrencyFromUSD({ from: from, to: to, amount: paymentInfo.dealprofit, podate: poDate })
    } else {
        dealProfitInUSD = paymentInfo.dealprofit;
    }

    return {
        dealProfitInUSD
    }

}

export { PaymentDealInfoForSeller, PaymentDealInfoForBuyer }
