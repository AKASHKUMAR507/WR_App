import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from "@react-native-community/netinfo";
import axios from "axios";
import { DeviceEventEmitter } from 'react-native';

const BASE_URL = {
    DEV: 'https://api.worldref.dev/dealx/rest/api/v1/',
    PROD: 'https://wr19dlx8r7nkmq1p6x.worldref.dev/dealx/rest/api/v1/',
}

const instance = axios.create({
    baseURL: BASE_URL.PROD,
    timeout: 60 * 1000,
});

instance.interceptors.response.use(async (response) => {
    return response;
}, async (error) => {
    if (error.status === 401 || error.response && error.response.status === 401) {
        DeviceEventEmitter.emit('logout');
        return;
    }

    return Promise.reject(error.response ? error.response.data : error);
});

const SetHeader = (key, value) => {
    instance.defaults.headers.common[key] = value;
}

const RemoveHeader = (key) => {
    delete instance.defaults.headers.common[key];
}

const StoreCache = async (key, value) => {
    try {
        await AsyncStorage.setItem(key, JSON.stringify(value));
    }
    catch (error) {
        return error;
    }
};

const GetCache = async key => {
    try {
        const value = await AsyncStorage.getItem(key);
        const item = JSON.parse(value);

        if (!item) return null;

        return item;
    }
    catch (error) {
        return error;
    }
};

const ResponseEncodings = {
    JSON: 'json',
    Stream: 'blob',
}

const RequestContentType = {
    JSON: 'application/json',
    FormData: 'multipart/form-data',
}

const Request = async (method, url, body, nocache = false, responseType = ResponseEncodings.JSON, requestContentType = RequestContentType.JSON) => {
    const requestOptions = {
        method: method,
        url: url,
        data: body,
        responseType: responseType,
        headers: { 'Content-Type': requestContentType }
    };

    try {
        const connected = await NetInfo.fetch();

        if (!connected.isConnected) {
            if (method === 'GET' && !nocache) {
                const cached = await GetCache(url);
                if (cached) return cached;
            }

            throw new Error("Please check your internet connection");
        }

        const response = await instance.request(requestOptions);
        if (method === 'GET' && !nocache) StoreCache(url, response);

        return response;
    }
    catch (error) {
        throw error;
    }
}

export { Request, ResponseEncodings, RequestContentType, SetHeader, RemoveHeader };