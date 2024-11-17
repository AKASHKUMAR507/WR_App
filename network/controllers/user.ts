import { Request, RequestContentType, ResponseEncodings } from '../network';

async function GetUserInfoController() {
    const url = `user/viewkeyinfo`;

    try {
        const response = await Request('GET', url);
        return response.data;
    }
    catch (error) {
        throw error;
    };
}

async function GetSummaryPageController() {
    const url = `user/hpbuyingsellingdeals`;

    try {
        const response = await Request('GET', url);
        return response.data;
    }
    catch (error) {
        throw error;
    };
}

async function AddOnboardingDetailsController(formData: FormData) {
    const url = `user/addonboardingdetails`;

    try {
        const response = await Request('POST', url, formData, false, ResponseEncodings.JSON, RequestContentType.FormData);
        return response.data;
    }
    catch (error) {
        throw error;
    };
}

async function AddProfileInfoController(formData: FormData) {
    const url = `user/addkeyinfo`;

    try {
        const response = await Request('POST', url, formData, false, ResponseEncodings.JSON, RequestContentType.FormData);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

async function FetchNotificationsController() {
    const url = `user/notification/fetchnotification`;

    try {
        const response = await Request('GET', url);
        return response.data;
    }
    catch (error) {
        throw error;
    };
}

async function FetchNewNotificationsController() {
    const url = `user/notification/app/getnotification`;
    try {
        const response = await Request('GET', url);
        return response.data;
    } catch (error) {
        throw error;
    }
}

async function UpdateNotificationController(params: number) {
    const url = `user/notification/updatenotification/${params}`;
    try {
        const response = await Request('POST', url);
        return response;
    } catch (error) {
        throw error;
    }
}

async function UpdateNewNotificationStatusController(params: { notificationId: number }) {
    const url = 'user/notification/updateusernotification'

    try {
        const response = await Request('POST', url, params);
        return response;
    } catch (error) {
        throw error;
    }
}

async function CleanNotificationController(params: number) {
    const url = '';
    try {
        const response = await Request('POST', url);
        return response;
    } catch (error) {
        throw error;
    }
}

export { GetUserInfoController, GetSummaryPageController, AddOnboardingDetailsController, AddProfileInfoController, FetchNotificationsController, UpdateNotificationController, CleanNotificationController, FetchNewNotificationsController, UpdateNewNotificationStatusController };