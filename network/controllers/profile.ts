import { Request, RequestContentType, ResponseEncodings } from "../network";
import { AttachmentsInterface } from "../network-utils";

interface AddSocialProfileInterface {
    profsummary: string,
    businessExp: any[],
    certifications: any[],
    socialMediaProfiles: any[],
}

interface AddTagsInterface {
    tagslist: any,
    deletedtagslist: any,
    addedtagslist: any,
}
interface AddProductInterface {
    prodsystem: string,
    prodsubsystem: string,
    productname: string,
    manufacturer: string,
    producttag: [],
    attachments: AttachmentsInterface[]
}

async function ViewSocialProfileController() {
    const url = 'user/action/viewsocialprofile';
    try {
        const response = await Request('GET', url);
        return response;
    } catch (err) {
        throw err;
    }
}

async function AddSocialProfileController(formData: FormData) {
    const url = 'user/action/addsocialprofile';
    try {
        const reaponse = await Request('POST', url, formData, false, ResponseEncodings.JSON, RequestContentType.FormData);
        return reaponse.data;
    } catch (err) {
        throw err;
    }
}

async function GetPredefineTagsController() {
    const url = 'user/action/getpredefinetags';
    try {
        const response = await Request('GET', url);
        return response;
    } catch (err) {
        throw err;
    }
}

async function ViewTagsController() {
    const url = 'user/action/viewtags';
    try {
        const response = Request('GET', url);
        return response;
    } catch (err) {
        throw err;
    }
}

async function AddTagsController(params: AddTagsInterface) {
    const url = 'user/action/addtags';
    try {
        const response = await Request('POST', url, params);
        return response;
    } catch (err) {
        throw err;
    }
}

async function AddProductController(formData: FormData) {
    const url = `buyer/add/product`;
    try {
        const response = await Request('POST', url, formData, false, ResponseEncodings.JSON, RequestContentType.FormData);
        return response;
    } catch (error) {
        throw error
    }
}

async function BuyerProfileInfoController() {
    const url = 'mrohub/get/profileDetails';
    try {
        const response = await Request('GET', url);
        return response;
    } catch (error) {
        throw error;
    }
}

export type { AddSocialProfileInterface, AddTagsInterface, AddProductInterface }
export { ViewSocialProfileController, AddSocialProfileController, GetPredefineTagsController, ViewTagsController, AddTagsController, AddProductController, BuyerProfileInfoController }