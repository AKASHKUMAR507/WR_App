import { DeviceEventEmitter } from 'react-native';
import { create } from 'zustand'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BuyerProfileInfo, ViewSocialProfile } from '../network/models/profile'
import { ViewPaymentDetails1, ViewPrivacySettings, VieweMailAndMessaging, GetAgreementTerms, ViewTickets, ViewTags } from '../network/models/setting'
import { ListLiveDeals, LiveDealDetails } from '../network/models/browsedeals'
import { GetMessages } from '../network/models/chat';
import { GetBuyersList, GetSellersList } from '../network/models/contacts';
import { ListEarnings, GetEarningsOverview } from '../network/models/earnings';
import { HpBuyingSellingDeal, Earnings, BuyerSearch, SellerSearch, ViewKeyInfo } from '../network/models/explore';
import { GetCountriesAndCities } from '../network/models/getcountriesandcities';
import { ViewTemplate } from '../network/models/mynetwork';
import { GetSummaryPage } from '../network/models/user';
import { DealDetails, ListBuyingDeals, ListSellingDeals } from '../network/models/deals';

const useBankType = create((set) => ({
    bankType: null,
    setBankType: async (type) => {
        set({bankType: type})
        await AsyncStorage.setItem('bankType', JSON.stringify(type))
    },
    loadBankType: async () =>{
        try {
            const bankType = await AsyncStorage.getItem('bankType');
            set(() => ({bankType: JSON.parse(bankType)}));
        } catch (error) {
            throw error;
        }
    } 
}))

const useSellingDeals = create((set) => ({
    sellingDeals: null,
    loadSellingDeals: async () => {
        try {
            const sellingDeals = await AsyncStorage.getItem('sellingDeals');
            set(() => ({ sellingDeals: JSON.parse(sellingDeals) }));
        } catch (error) {
            throw error;
        }
    },
    fetchSellingDeals: async (dealsFilters) => {
        try {
            const sellingDeals = await ListSellingDeals(dealsFilters);
            set(() => ({ sellingDeals: sellingDeals }));
            await AsyncStorage.setItem('sellingDeals', JSON.stringify(sellingDeals));
        } catch (error) {
            throw error;
        }
    }
}))

const useBuyingDeals = create((set) => ({
    buyingDeals: null,
    loadBuyingDeals: async () => {
        try {
            const buyingDeals = await AsyncStorage.getItem('buyingDeals');
            set(() => ({ buyingDeals: JSON.parse(buyingDeals) }));
        } catch (error) {
            throw error;
        }
    },
    fetchBuyingDeals: async (dealsFilters) => {
        try {
            const buyingDeals = await ListBuyingDeals(dealsFilters);
            set(() => ({ buyingDeals: buyingDeals }));
            await AsyncStorage.setItem('buyingDeals', JSON.stringify(buyingDeals));
        } catch (error) {
            throw error;
        }
    }
}))


const useSocialProfileStore = create((set) => ({
    socialProfile: null,
    loadSocialProfile: async () => {
        try {
            const socialProfile = await AsyncStorage.getItem('socialProfile');
            set(() => ({ socialProfile: JSON.parse(socialProfile) }));
        }
        catch (error) {
            throw error;
        }
    },
    fetchSocialProfile: async () => {
        try {
            const socialProfile = await ViewSocialProfile();
            set(() => ({ socialProfile: socialProfile.data }));
            await AsyncStorage.setItem('socialProfile', JSON.stringify(socialProfile));
        } catch (error) {
            throw error
        }
    }
}))

const useBankDetailsStore = create((set) => ({
    bankDetails: null,
    loadBankdDetails: async () => {
        try {
            const bankDetails = await AsyncStorage.getItem('bankDetails');
            set(() => ({ bankDetails: JSON.parse(bankDetails) }));
        } catch (error) {
            throw error;
        }
    },
    fetchBankDetails: async () => {
        try {
            const bankDetails = await ViewPaymentDetails1();
            set(() => ({ bankDetails: bankDetails.data }));
            await AsyncStorage.setItem('bankDetails', JSON.stringify(bankDetails));
        } catch (error) {
            throw error;
        }
    }
}))

const usePrivacy = create((set) => ({
    privacy: null,
    loadPrivacy: async () => {
        try {
            const privacy = await AsyncStorage.getItem('privacy');
            set(() => ({ privacy: JSON.parse(privacy) }));
        } catch (error) {
            throw error;
        }
    },
    fetchPrivacy: async () => {
        try {
            const privacy = await ViewPrivacySettings();
            set(() => ({ privacy: privacy.data }));
            await AsyncStorage.setItem('privacy', JSON.stringify(privacy.data))
        } catch (error) {
            throw error
        }
    }
}))

const useNotification = create((set) => ({
    notification: null,
    loadNotification: async () => {
        try {
            const notification = await AsyncStorage.getItem('notification');
            set(() => ({ notification: notification }));
        } catch (error) {
            throw error
        }
    },
    fetchNotification: async () => {
        try {
            const notification = await VieweMailAndMessaging();
            set(() => ({ notification: notification.data }));
            await AsyncStorage.setItem('notification', JSON.stringify(notification.data));
        } catch (error) {
            throw error
        }
    }
}))

const useAgreementTerms = create((set) => ({
    agreement: null,
    loadAgreement: async () => {
        try {
            const agreement = await AsyncStorage.getItem('agreement');
            set(() => ({ agreement: JSON.parse(agreement) }));
        } catch (error) {
            throw error
        }
    },
    fetchAgreement: async () => {
        try {
            const agreement = await GetAgreementTerms();
            set(() => ({ agreement: agreement.data }));
            await AsyncStorage.setItem('agreement', JSON.stringify(agreement.data));
        } catch (error) {
            throw error;
        }
    }
}))

const useTickets = create((set) => ({
    tickets: [],
    loadTickets: async () => {
        try {
            const tickets = await AsyncStorage.getItem('tickets');
            set(() => ({ tickets: JSON.parse(tickets) }));
        } catch (error) {
            throw error
        }
    },
    fetchTickets: async () => {
        try {
            const tickets = await ViewTickets();
            set(() => ({ tickets: tickets.data }));
            await AsyncStorage.setItem('tickets', JSON.stringify(tickets.data));
        } catch (error) {
            throw error;
        }
    }
}))

const useTags = create((set) => ({
    tags: null,
    loadTags: async () => {
        try {
            const tags = await AsyncStorage.getItem('tags');
            set(() => ({ tags: JSON.parse(tags) }));
        } catch (error) {
            throw error;
        }
    },
    fetchTags: async () => {
        try {
            const tags = await ViewTags();
            set(() => ({ tags: tags.data }));
            await AsyncStorage.setItem('tags', JSON.stringify(tags.data));
        } catch (error) {
            throw error;
        }
    }
}))

const useListLiveDeals = create((set) => ({
    listLiveDeals: null,
    loadListLiveDeals: async () => {
        try {
            const listLiveDeals = await AsyncStorage.getItem('listLiveDeals');
            set(() => ({ listLiveDeals: JSON.parse(listLiveDeals) }));
        } catch (error) {
            throw error;
        }
    },
    fetchListLiveDeal: async () => {
        try {
            const listLiveDeals = await ListLiveDeals();
            set(() => ({ listLiveDeals: listLiveDeals }));
            await AsyncStorage.setItem('listLiveDeals', JSON.stringify(listLiveDeals));
        } catch (error) {
            throw error;
        }
    }
}))

const useLiveDealDetails = create((set) => ({
    liveDealDetails: null,
    loadLiveDealDetails: async () => {
        try {
            const liveDealDetails = await AsyncStorage.getItem('liveDealDetails');
            set(() => ({ liveDealDetails: JSON.parse(liveDealDetails) }))
        } catch (error) {
            throw error;
        }
    },
    fetchLiveDealDetails: async (dealid) => {
        try {
            const liveDealDetails = await LiveDealDetails(dealid);
            set(() => ({ liveDealDetails: liveDealDetails }))
            await AsyncStorage.setItem('liveDealDetails', JSON.stringify(liveDealDetails))
        } catch (error) {
            throw error;
        }
    }
}))

const useGetMessages = create((set) => ({
    messages: null,
    loadGetMessage: async () => {
        try {
            const message = await AsyncStorage.getItem('message');
            set(() => ({ message: JSON.parse(message) }));
        } catch (error) {
            throw error;
        }
    },
    fetchGetMessages: async (dealid) => {
        try {
            const message = await GetMessages(dealid);
            set(() => ({ messages: message }));
            await AsyncStorage.setItem('message', JSON.stringify(message))
        } catch (error) {
            throw error;
        }
    }
}))

const useBuyersList = create((set) => ({
    buyersList: null,
    loadBuyerList: async () => {
        try {
            const buyerList = await AsyncStorage.getItem('buyerList');
            set(() => ({ buyerList: JSON.parse(buyerList) }));
        } catch (error) {
            throw error;
        }
    },
    fetchBuyersList: async () => {
        try {
            const buyersList = await GetBuyersList();
            set(() => ({ buyersList: buyersList }));
            await AsyncStorage.setItem('buyerList', JSON.stringify(buyersList));
        } catch (error) {
            throw error;
        }
    }
}))

const useSellersList = create((set) => ({
    sellersList: null,
    loadSellersList: async () => {
        try {
            const sellersList = await AsyncStorage.getItem('sellersList');
            set(() => ({ sellersList: JSON.parse(sellersList) }));
        } catch (error) {
            throw error;
        }
    },
    fetchSellersList: async () => {
        try {
            const sellersList = await GetSellersList();
            set(() => ({ sellersList: sellersList }));
            await AsyncStorage.setItem('sellersList', JSON.stringify(sellersList))
        } catch (error) {
            throw error;
        }
    }
}))

const useListEarnings = create((set) => ({
    listEarnings: null,
    loadListEarnings: async () => {
        try {
            const listEarnings = await AsyncStorage.getItem('listEarnings');
            set(() => ({ listEarnings: JSON.parse(listEarnings) }));
        } catch (error) {
            throw error;
        }
    },
    fetchListEarnings: async (params) => {
        try {
            const listEarnings = await ListEarnings(params);
            set(() => ({ listEarnings: listEarnings }));
            await AsyncStorage.setItem('listEarnings', JSON.stringify(listEarnings));
        } catch (error) {
            throw error;
        }
    }
}))

const useEarningsOverview = create((set) => ({
    earningsOverview: null,
    loadEarningsOverview: async () => {
        const earningsOverview = await AsyncStorage.getItem('earningsOverview');
        set(() => ({ earningsOverview: JSON.parse(earningsOverview) }));
    },
    fetchEarningsOverview: async () => {
        try {
            const earningsOverview = await GetEarningsOverview();
            set(() => ({ earningsOverview: earningsOverview }));
            AsyncStorage.setItem('earningsOverview', JSON.stringify(earningsOverview));
        } catch (error) {
            throw error;
        }
    }
}))

const useHpBuyingSellingDeal = create((set) => ({
    hpBuyingSellingDeal: null,
    loadHpBuyingSellingDeal: async () => {
        const hpBuyingSellingDeal = await AsyncStorage.getItem('hpBuyingSellingDeal');
        set(() => ({ hpBuyingSellingDeal: JSON.parse(hpBuyingSellingDeal) }));
    },
    fetchHpBuyingSellingDeal: async () => {
        try {
            const hpBuyingSellingDeal = await HpBuyingSellingDeal();
            set(() => ({ hpBuyingSeallingDeal: hpBuyingSellingDeal }));
            await AsyncStorage.setItem('hpBuyingSellingDeal', JSON.stringify(hpBuyingSellingDeal))
        } catch (error) {
            throw error;
        }
    }
}))

const useEarnings = create((set) => ({
    earnings: null,
    loadEarnings: async () => {
        const earnings = await AsyncStorage.getItem('earnings');
        set(() => ({ earnings: JSON.parse(earnings) }));
    },
    fetchEarnings: async () => {
        try {
            const earnings = await Earnings();
            set(() => ({ earnings: earnings }));
            await AsyncStorage.setItem('earnings', JSON.stringify(earnings));
        } catch (error) {
            throw error;
        }
    }
}))

const useBuyerSearch = create((set) => ({
    buyerSearch: null,
    loadBuyerSearch: async () => {
        const buyerSearch = await AsyncStorage.getItem('buyerSearch');
        set(() => ({ buyerSearch: JSON.parse(buyerSearch) }));
    },
    fetchBuyerSearch: async () => {
        try {
            const buyerSearch = await BuyerSearch();
            set(() => ({ buyerSearch: buyerSearch }));
            await AsyncStorage.setItem('buyerSearch', JSON.stringify(buyerSearch));
        } catch (error) {
            throw error;
        }
    }
}))

const useSellerSearch = create((set) => ({
    sellerSearch: null,
    loadSellerSearch: async () => {
        const sellerSearch = await AsyncStorage.getItem('sellerSearch');
        set(() => ({ sellerSearch: JSON.parse(sellerSearch) }));
    },
    fetchSellerSearch: async () => {
        try {
            const sellerSearch = await SellerSearch();
            set(() => ({ sellerSearch: sellerSearch }));
            await AsyncStorage.setItem('sellerSearch', JSON.stringify(sellerSearch));
        } catch (error) {
            throw error;
        }
    }
}))

const useViewKeyInfo = create((set) => ({
    viewKeyInfo: null,
    loadViewKeyInfo: async () => {
        const viewKeyInfo = AsyncStorage.getItem('viewKeyInfo');
        set(() => ({ viewKeyInfo: JSON.parse(viewKeyInfo) }));
    },
    fetchViewKeyInfo: async () => {
        try {
            const viewKeyInfo = await ViewKeyInfo();
            set(() => ({ viewKeyInfo: viewKeyInfo.data }));
            await AsyncStorage.setItem('viewKeyInfo', JSON.stringify(viewKeyInfo.data));
        } catch (error) {
            throw error;
        }
    }
}))

const useGetCountriesAndCities = create((set) => ({
    countriesAndCities: null,
    loadCountriesAndCities: async () => {
        const countriesAndCities = await AsyncStorage.getItem('countriesAndCities');
        set(() => ({ countriesAndCities: JSON.parse(countriesAndCities) }));
    },
    fetchCountriesAndCities: async () => {
        try {
            const countriesAndCities = await GetCountriesAndCities();
            set(() => ({ countriesAndCities: countriesAndCities }));
            await AsyncStorage.setItem('countriesAndCities', JSON.stringify(countriesAndCities));
        } catch (error) {
            throw error;
        }
    }
}))

const useViewTemplate = create((set) => ({
    template: null,
    loadTemplate: async () => {
        const template = await AsyncStorage.getItem('template');
        set(() => ({ template: JSON.parse(template) }));
    },
    fetchTemplate: async () => {
        try {
            const template = await ViewTemplate();
            set(() => ({ template: template }));
            await AsyncStorage.setItem('template', JSON.stringify(template));
        } catch (error) {
            throw error;
        }
    }
}))


const useSummaryPage = create((set) => ({
    summaryPageDetails: null,
    loadSummaryPage: async () => {
        try {
            const summaryPage = await AsyncStorage.getItem('summaryPage');
            set(() => ({ summaryPageDetails: JSON.parse(summaryPage) }));
        } catch (error) {
            throw error;
        }
    },
    fetchSummaryPage: async () => {
        try {
            const summaryPage = await GetSummaryPage();
            set(() => ({ summaryPageDetails: summaryPage }));
            await AsyncStorage.setItem('summaryPage', JSON.stringify(summaryPage));
        } catch (error) {
            throw error;
        }
    }
}))


const useDealDetails = create((set) => ({
    dealDetails: null,
    loadDealDetails: async () => {
        try {
            const dealDetails = await AsyncStorage.getItem('dealDetails');
            set(() => ({dealDetails: JSON.parse(dealDetails)}));
        } catch (error) {
            throw error;
        }
    },
    fetchDealDetails: async (params) => {
        try {
            const dealDetails = await DealDetails({ dealid: params.dealid, role: params.role, rfqid: params.rfqid });
            set(() => ({dealDetails: dealDetails}));
            await AsyncStorage.setItem('dealDetails', JSON.stringify(dealDetails));
        } catch (error) {
            throw error;
        }
    }
}))

const useBuyerProfileInformation = create((set) => ({
    buyerProfileInfo: null,
    loadBuyerProfileInfo: async() => {
        try {
            const buyerProfileDetails = await AsyncStorage.getItem('buyerProfileInfo');
            set(() => ({buyerProfileInfo: JSON.parse(buyerProfileDetails)}));
        } catch (error) {
            throw error;
        }
    },
    fetchBuyerProfileInfo: async () => {
        try {
            const buyerProfileInfo = await BuyerProfileInfo();
            set(() => ({buyerProfileInfo: buyerProfileInfo}));
            await AsyncStorage.setItem('buyerProfileInfo', JSON.stringify(buyerProfileInfo));
        } catch (error) {
            throw error;
        }
    }
}))


export {
    useSocialProfileStore, useBankDetailsStore, usePrivacy, useNotification, useAgreementTerms, useTickets, useTags, useListLiveDeals, useLiveDealDetails, useGetMessages,
    useBuyersList, useSellersList, useListEarnings, useEarningsOverview, useHpBuyingSellingDeal, useEarnings, useBuyerSearch, useSellerSearch, useViewKeyInfo, useGetCountriesAndCities,
    useViewTemplate, useSummaryPage, useSellingDeals, useBuyingDeals, useBankType, useDealDetails, useBuyerProfileInformation
}