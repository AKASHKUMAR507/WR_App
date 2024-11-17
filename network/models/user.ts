import { AddOnboardingDetailsController, AddProfileInfoController, CleanNotificationController, FetchNewNotificationsController, FetchNotificationsController, GetSummaryPageController, GetUserInfoController, UpdateNewNotificationStatusController, UpdateNotificationController } from "../controllers/user";
import { AppendFilesToFormData, AttachmentsInterface } from "../network-utils";

interface OnboardingDataInterface { name: string, email: string, mobilenumber: string, mobile_ext: string, addressline1: string, addressline2: string, city: string, country: string, pincode: string, tagslist: any[] }
interface ProfileInfoInterface { name: string, email: string, mobilenumber: string, mobile_ext: string, addressline1: string, addressline2: string, city: string, country: string, pincode: string, company: string, department: string, designation: string, website: string, iddoctype: string, idnumber: string, attachments: AttachmentsInterface[] }

async function GetUserInfo() {
    try {
        const response = await GetUserInfoController();
        return response;
    }
    catch (error) {
        throw error;
    }
}

async function GetSummaryPage() {
    try {
        const response = await GetSummaryPageController();
        return response;
    }
    catch (error) {
        throw error;
    }
}

async function AddOnboardingDetails(params: OnboardingDataInterface) {
    try {
        const modifiedTagList = params.tagslist.map((tag) => {
            return {
                tagid: tag.tagid,
                categoryname: tag.categoryname,
                subcategoryname: tag.subcategoryname,
                tagname: tag.tagname,
                associateid: tag.addedby
            };
        }); // TODO: Shouldn't be required, but the API is expecting this format

        const onboardingDataObject = {
            name: params.name,
            email: params.email,
            mobile_ext: params.mobile_ext,
            mobilenumber: params.mobilenumber,
            addressline1: params.addressline1,
            addressline2: params.addressline2 || '',
            city: params.city,
            country: params.country,
            pincode: params.pincode,
            tagslist: modifiedTagList,
            sfcheck: true,
            tnccheck: true,
        };

        const formData = new FormData();
        formData.append('onboardingdetails', JSON.stringify(onboardingDataObject));

        const response = await AddOnboardingDetailsController(formData);
        return response;
    }
    catch (error) {
        throw error;
    }
}

async function AddProfileInfo(params: ProfileInfoInterface) {
    try {
        const profileInfoObject = {
            name: params.name,
            email: params.email,
            mobile_ext: params.mobile_ext,
            mobilenumber: params.mobilenumber,
            addressline1: params.addressline1,
            addressline2: params.addressline2 || '',
            city: params.city,
            country: params.country,
            pincode: params.pincode,
            company: params.company || '',
            department: params.department || '',
            designation: params.designation || '',
            website: params.website || '',
            iddoctype: params.iddoctype || '',
            idnumber: params.idnumber || '',
        };

        const formData = new FormData();
        formData.append('keyinfo', JSON.stringify(profileInfoObject));
        AppendFilesToFormData(formData, params.attachments, 'idcardfile');

        const response = await AddProfileInfoController(formData);
        return response;
    }
    catch (error) {
        throw error;
    }
}

async function FetchNotifications() {
    try {
        const response = await FetchNotificationsController();

        const groupedNotifications: any = {};

        response.notifications.forEach((notification: any) => {
            if (!groupedNotifications[notification.category]) {
                groupedNotifications[notification.category] = [];
            }

            groupedNotifications[notification.category].push(notification);
        });

        return { notifications: groupedNotifications, unread: response.newNotificationCount }
    }
    catch (error) {
        throw error;
    }
}

async function FetchNewNotifications() {
    try {
        const response = FetchNewNotificationsController();
        return response;
    } catch (error) {
        throw error;
    }
}

async function UpdateNotification(params: number) {
    try {
        const response = await UpdateNotificationController(params);
        return response;
    } catch (error) {
        throw error;
    }
}

async function UpdateNewNotificationStatus(params: { notificationId: number }) {
    try {
        const response = await UpdateNewNotificationStatusController(params);
        return response;
    } catch (error) {
        throw error;
    }
}

async function CleanNotification(params: number) {
    try {
        const response = await CleanNotificationController(params);
        return response;
    } catch (error) {
        throw error;
    }
}

export { GetUserInfo, GetSummaryPage, AddOnboardingDetails, AddProfileInfo, FetchNotifications, UpdateNotification, CleanNotification, FetchNewNotifications, UpdateNewNotificationStatus }