import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { GetSortedPredefinedTags, GetSortedUserTags } from '../network/models/tags';
import { FetchNewNotifications, FetchNotifications } from '../network/models/user';

const usePredefinedTagsDataStore = create((set) => ({
    predefinedTags: null,
    loadPredefinedTags: async () => {
        try {
            const tags = await AsyncStorage.getItem('predefinedTags');
            set(() => ({ predefinedTags: JSON.parse(tags) }));
        }
        catch (error) {
            throw error;
        }
    },
    fetchPredefinedTags: async () => {
        try {
            const predefinedTags = await GetSortedPredefinedTags();
            set(() => ({ predefinedTags: predefinedTags }));
            await AsyncStorage.setItem('predefinedTags', JSON.stringify(predefinedTags));
        }
        catch (error) {
            throw error;
        }
    }
}));

const useUserTagsDataStore = create((set) => ({
    userTags: null,
    loadUserTags: async () => {
        try {
            const tags = await AsyncStorage.getItem('userTags');
            set(() => ({ userTags: JSON.parse(tags) }));
        }
        catch (error) {
            throw error;
        }
    },
    fetchUserTags: async () => {
        try {
            const userTags = await GetSortedUserTags();
            set(() => ({ userTags: userTags }));
            await AsyncStorage.setItem('userTags', JSON.stringify(userTags));
        }
        catch (error) {
            throw error;
        }
    }
}));

const useNotificationsDataStore = create((set) => ({
    notifications: null,
    loadNotifications: async () => {
        try {
            const notifications = await AsyncStorage.getItem('notifications');
            set(() => ({ notifications: JSON.parse(notifications) }));
        }
        catch (error) {
            throw error;
        }
    },
    fetchNotifications: async () => {
        try {
            const notifications = await FetchNotifications();
            set(() => ({ notifications: notifications }));
            await AsyncStorage.setItem('notifications', JSON.stringify(notifications));
        }
        catch (error) {
            throw error;
        }
    }
}));

const useNewNotificationsDataStore = create((set) => ({
    notifications: null,
    unread: null,

    loadNotification: async () => {
        try {
            const notification = await AsyncStorage.getItem('notification');
            set(() => ({ notifications: JSON.parse(notification) }));
        }
        catch (error) {
            throw error;
        }
    },
    fetchNotification: async () => {
        try {
            const notification = await FetchNewNotifications();
            set(() => ({ notifications: notification }));
            set(() => ({ unread: notification.newNotificationCount }));
            await AsyncStorage.setItem('notification', JSON.stringify(notification));
        }
        catch (error) {
            throw error;
        }
    }
}))

const usePushNotificationsDataStore = create((set) => ({
    notifications: null,
    notificationNav: null,
    setPushNotifications: async (newNotification) => {
        try {
            set(() => ({ notifications: newNotification }))
            setTimeout(() => {
                set(() => ({ notifications: null }))
            }, 2000)
        } catch (error) {
            throw error;
        }
    },

    setNavigation: (newNoti) => {
        set(() => ({notificationNav: newNoti}))
    }
}))

export { usePredefinedTagsDataStore, useUserTagsDataStore, useNotificationsDataStore, usePushNotificationsDataStore, useNewNotificationsDataStore };