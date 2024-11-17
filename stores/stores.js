import { create } from 'zustand';
import { DealModes, NetworkModes } from '../components/modeselectors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DeviceEventEmitter } from 'react-native';
import * as Sentry from '@sentry/react-native';
import { AttachmentModes } from '../buyerdashboard/viewbuyerattachment';


const useRefreshScreensStore = create((set) => ({
    refreshScreens: [],
    scheduleRefresh: (screen) => {
        set((state) => ({ refreshScreens: [...state.refreshScreens, screen] }));
    },
    refreshScreen: (screen) => {
        set((state) => ({ refreshScreens: state.refreshScreens.filter((item) => item !== screen) }));
    }
}));

// TODO: the caller of this function resides in the App component's useEffect hook, where AlertBoxContext is not available. 
// Find a way to call this function from where it can access the AlertBoxContext, and the catch can be handled.
const useUserStore = create((set) => ({
    user: {},
    userOnboarded: false,
    setUser: async (user) => {
        try {
            set(() => ({ user: user }));
            await AsyncStorage.setItem('user', JSON.stringify(user));

            Sentry.setUser(user ? { email: user.email, associate_id: user.associateid, user_ref_id: user.userrefid, name: user.name } : null);
        }
        catch (error) {
            DeviceEventEmitter.emit('alert', { message: error.message })
        }
    },
    getUser: async () => {
        try {
            const user = await AsyncStorage.getItem('user');
            set(() => ({ user: JSON.parse(user) }));

            const onboarded = await AsyncStorage.getItem('userOnboarded');
            set(() => ({ userOnboarded: JSON.parse(onboarded) || false }));
        }
        catch (error) {
            DeviceEventEmitter.emit('alert', { message: error.message })
        }
    },
    setUserOnboarded: async (onboarded) => {
        try {
            set(() => ({ userOnboarded: onboarded }));
            await AsyncStorage.setItem('userOnboarded', JSON.stringify(onboarded));
        }
        catch (error) {
            DeviceEventEmitter.emit('alert', { message: error.message })
        }
    },
}));

// TODO: the caller of this function resides in the App component's useEffect hook, where AlertBoxContext is not available. 
// Find a way to call this function from where it can access the AlertBoxContext, and the catch can be handled.
const useDealsModeStore = create((set) => ({
    dealsMode: DealModes.Selling,
    setDealsMode: async (mode) => {
        try {
            set(() => ({ dealsMode: mode }));
            await AsyncStorage.setItem('dealsMode', mode);
        }
        catch (error) {
            DeviceEventEmitter.emit('alert', { message: error.message })
        }
    },
    getDealsMode: async () => {
        try {
            const mode = await AsyncStorage.getItem('dealsMode') ?? DealModes.Selling;
            set(() => ({ dealsMode: mode }));
        }
        catch (error) {
            DeviceEventEmitter.emit('alert', { message: error.message })
        }
    }
}));
// TODO: the caller of this function resides in the App component's useEffect hook, where AlertBoxContext is not available. 
// Find a way to call this function from where it can access the AlertBoxContext, and the catch can be handled.
const useAttachmentModeStore = create((set) => ({
    attachmentMode: AttachmentModes.Seller,
    setAttachmentMode: async (mode) => {
        try {
            set(() => ({ attachmentMode: mode }));
            await AsyncStorage.setItem('attachmentMode', mode);
        }
        catch (error) {
            DeviceEventEmitter.emit('alert', { message: error.message })
        }
    },
    getAttachmentMode: async () => {
        try {
            const mode = await AsyncStorage.getItem('attachmentMode') ?? AttachmentModes.Seller;
            set(() => ({ attachmentMode: mode }));
        }
        catch (error) {
            DeviceEventEmitter.emit('alert', { message: error.message })
        }
    }
}));

// TODO: the caller of this function resides in the App component's useEffect hook, where AlertBoxContext is not available. 
// Find a way to call this function from where it can access the AlertBoxContext, and the catch can be handled.
const useDealsFilterStore = create((set) => ({
    dealsFilter: {
        roletype: { ACTIVE: true, PASSIVE: true },
        dealstatus: { SUBMITTED: true, LIVE: true, QUOTED: true, PO_RELEASED: true, INVOICED: true, PARTIALLY_PAID: true, FULLY_PAID: true, DELIVERED: true, REJECTED: true, LOST: true, SUSPENDED: true, CANCELLED: true, ORDER_CONFIRMED: true, DRAFT: true, ORDER_PLACED: true }
    },
    setDealsFilter: async (filter) => {
        try {
            set(() => ({ dealsFilter: filter }));
            await AsyncStorage.setItem('dealsFilter', JSON.stringify(filter));
        }
        catch (error) {
            DeviceEventEmitter.emit('alert', { message: error.message })
        }
    },
    getDealsFilter: async () => {
        try {
            const filter = await AsyncStorage.getItem('dealsFilter') ?? {
                roletype: { ACTIVE: true, PASSIVE: true },
                dealstatus: { SUBMITTED: true, LIVE: true, QUOTED: true, PO_RELEASED: true, INVOICED: true, PARTIALLY_PAID: true, FULLY_PAID: true, DELIVERED: true, REJECTED: true, LOST: true, SUSPENDED: true, CANCELLED: true, ORDER_CONFIRMED: true, DRAFT: true, ORDER_PLACED: true }
            };
            set(() => ({ dealsFilter: JSON.parse(filter) }));
        }
        catch (error) {
            DeviceEventEmitter.emit('alert', { message: error.message })
        }
    }
}));
// TODO: the caller of this function resides in the App component's useEffect hook, where AlertBoxContext is not available. 
// Find a way to call this function from where it can access the AlertBoxContext, and the catch can be handled.
const useMroHubDealsFilterStore = create((set) => ({
    dealsFilter: {
        pagenum: { PAGE_NUM: true },
        elements: { ELEMENTS: true },
        dealstatus: { ALL: true, LIVE: false, ORDER_CONFIRMED: false, ORDER_PLACED: false, DELIVERED: false, DRAFT: false, CANCELLED: false, INPROGRESS: false }
    },
    setDealsFilter: async (filter) => {
        try {
            set(() => ({ dealsFilter: filter }));
            await AsyncStorage.setItem('dealsFilter', JSON.stringify(filter));
        }
        catch (error) {
            DeviceEventEmitter.emit('alert', { message: error.message })
        }
    },
    getDealsFilter: async () => {
        try {
            const filter = await AsyncStorage.getItem('dealsFilter') ?? {
                pagenum: { PAGE_NUM: true },
                elements: { ELEMENTS: true },
                dealstatus: { ALL: true, LIVE: false, ORDER_CONFIRMED: false, ORDER_PLACED: false, DELIVERED: false, DRAFT: false, CANCELLED: false, INPROGRESS: false }
            };
            set(() => ({ dealsFilter: JSON.parse(filter) }));
        }
        catch (error) {
            DeviceEventEmitter.emit('alert', { message: error.message })
        }
    }
}));

// TODO: the caller of this function resides in the App component's useEffect hook, where AlertBoxContext is not available. 
// Find a way to call this function from where it can access the AlertBoxContext, and the catch can be handled.
const useEarningsFilterStore = create((set) => ({
    earningsFilter: {
        dealtype: { BUYING: true, SELLING: true },
        claimstatus: { ELIGIBLE_FOR_CLAIM: true, NOT_ELIGIBLE_FOR_CLAIM: true, CLAIM_UNDER_PROCESS: true, SUCCESS_FEE_PAID: true, SUCCESS_FEE_NOT_PAID: true }
    },
    setEarningsFilter: async (filter) => {
        try {
            set(() => ({ earningsFilter: filter }));
            await AsyncStorage.setItem('earningsFilter', JSON.stringify(filter));
        }
        catch (error) {
            DeviceEventEmitter.emit('alert', { message: error.message })
        }
    },
    getEarningsFilter: async () => {
        try {
            const filter = await AsyncStorage.getItem('earningsFilter') ?? {
                dealtype: { BUYING: true, SELLING: true },
                claimstatus: { ELIGIBLE_FOR_CLAIM: true, NOT_ELIGIBLE_FOR_CLAIM: true, CLAIM_UNDER_PROCESS: true, SUCCESS_FEE_PAID: true, SUCCESS_FEE_NOT_PAID: true }
            };
            set(() => ({ earningsFilter: JSON.parse(filter) }));
        }
        catch (error) {
            DeviceEventEmitter.emit('alert', { message: error.message })
        }
    }
}));

// TODO: the caller of this function resides in the App component's useEffect hook, where AlertBoxContext is not available. 
// Find a way to call this function from where it can access the AlertBoxContext, and the catch can be handled.
const useNetworkModeStore = create((set) => ({
    networkMode: NetworkModes.Buyers,
    setNetworkMode: async (mode) => {
        try {
            set(() => ({ networkMode: mode }));
            await AsyncStorage.setItem('networkMode', mode);
        }
        catch (error) {
            DeviceEventEmitter.emit('alert', { message: error.message })
        }
    },
    getNetworkMode: async () => {
        try {
            const mode = await AsyncStorage.getItem('networkMode') ?? NetworkModes.Buyers;
            set(() => ({ networkMode: mode }));
        }
        catch (error) {
            DeviceEventEmitter.emit('alert', { message: error.message })
        }
    }
}));

function getCurrentRouteFromNavigationState(navigationState) {
    if (!navigationState) return null;
    const route = navigationState.routes[navigationState.index];
    if (route.state) return getCurrentRouteFromNavigationState(route.state);
    return route.name;
}

const useDrawerSheetStore = create((set) => ({
    drawerSheets: {},
    currentRoute: null,
    previousRoute: null,
    addDrawerSheet: (drawerSheetObject) => {
        set((state) => {
            const drawerSheets = { ...state.drawerSheets };

            if (drawerSheets[drawerSheetObject.name]) { drawerSheets[drawerSheetObject.name].children = drawerSheetObject.children }
            else { drawerSheets[drawerSheetObject.name] = drawerSheetObject }

            return { drawerSheets: drawerSheets };
        });
    },
    removeDrawerSheet: (drawerSheetName) => {
        set((state) => {
            const drawerSheets = { ...state.drawerSheets };
            delete drawerSheets[drawerSheetName];
            return { drawerSheets: drawerSheets };
        });
    },
    openDrawerSheet: (drawerSheetName) => {
        set((state) => {
            const drawerSheets = { ...state.drawerSheets };
            drawerSheets[drawerSheetName].open = true;
            return { drawerSheets: drawerSheets };
        });
    },
    closeDrawerSheet: (drawerSheetName) => {
        set((state) => {
            const drawerSheets = { ...state.drawerSheets };
            drawerSheets[drawerSheetName].open = false;
            return { drawerSheets: drawerSheets };
        });
    },
    toggleDrawerSheet: (drawerSheetName) => {
        set((state) => {
            const drawerSheets = { ...state.drawerSheets };
            drawerSheets[drawerSheetName].open = !drawerSheets[drawerSheetName].open;
            return { drawerSheets: drawerSheets };
        });
    },
    updateDrawerSheetOpen: (drawerSheetName, open) => {
        set((state) => {
            const drawerSheets = { ...state.drawerSheets };
            drawerSheets[drawerSheetName].open = open;
            return { drawerSheets: drawerSheets };
        });
    },
    updateNavigationState: (navigationState) => {
        const currentRoute = getCurrentRouteFromNavigationState(navigationState);
        set((state) => ({ currentRoute: currentRoute, previousRoute: state.currentRoute }));
    }
}));

const useCurrentDealStore = create((set) => ({
    currentDeal: null,
    setCurrentDeal: (deal) => {
        set(() => ({ currentDeal: deal }));
    },
    clearCurrentDeal: () => {
        set(() => ({ currentDeal: null }));
    }
}));

const useCurrentProductStore = create((set) => ({
    currentBuyerProduct: null,
    setCurrentBuyerProduct: (product) => {
        set(() => ({ currentBuyerProduct: product }));
    },
    clearCurrentBuyerProduct: () => {
        set(() => ({ currentBuyerProduct: null }));
    }
}))

// TODO: Consider moving this to contexts instead, does not exactly warrant the use of global stores
const useCurrentOnboardingPageStore = create((set) => ({
    currentOnboardingPage: null,
    setCurrentOnboardingPage: (page) => {
        set(() => ({ currentOnboardingPage: page }));
    },
}));

const useOnboardingInfoStore = create((set) => ({
    onboardingInfo: {},
    addOnboardingInfo: (info) => {
        Object.keys(info).forEach((key) => {
            set((state) => ({ onboardingInfo: { ...state.onboardingInfo, [key]: info[key] } }));
        });
    },
}));

// TODO: the caller of this function resides in the App component's useEffect hook, where AlertBoxContext is not available. 
// Find a way to call this function from where it can access the AlertBoxContext, and the catch can be handled.
const useDemoModeStore = create((set) => ({
    demoMode: true,
    getDemoMode: async () => {
        try {
            const mode = await AsyncStorage.getItem('demoMode') ?? true;
            set(() => ({ demoMode: JSON.parse(mode) }));
        }
        catch (error) {
            DeviceEventEmitter.emit('alert', { message: error.message })
        }
    },
    setDemoMode: async (mode) => {
        try {
            set(() => ({ demoMode: mode }));
            await AsyncStorage.setItem('demoMode', JSON.stringify(mode));
        }
        catch (error) {
            DeviceEventEmitter.emit('alert', { message: error.message })
        }
    },
}));

const useFcmToken = create((set) => ({
    fcmToken: null,
    setFcmToken: async (token) => {
        try {
            set(() => ({ fcmToken: token }));
            await AsyncStorage.setItem('fcmtoken', JSON.stringify(token));
        } catch (error) {
            DeviceEventEmitter.emit('alert', { message: error.message });
        }
    },

    getFcmToken: async () => {
        try {
            const token = await AsyncStorage.getItem('fcmtoken');
            set(() => ({ fcmToken: JSON.parse(token) }));
        } catch (error) {
            DeviceEventEmitter.emit('alert', { message: error.message })
        }
    }
}))

export { useRefreshScreensStore, useUserStore, useDealsModeStore, useAttachmentModeStore, useDealsFilterStore, useEarningsFilterStore, useNetworkModeStore, useDrawerSheetStore, useCurrentDealStore, useCurrentOnboardingPageStore, useOnboardingInfoStore, useDemoModeStore, useCurrentProductStore, useMroHubDealsFilterStore, useFcmToken };