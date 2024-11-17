import { AddProductController, AddProductInterface, BuyerProfileInfoController, GetPredefineTagsController, ViewSocialProfileController } from "../controllers/profile";
import { AddSocialProfileInterface, AddSocialProfileController } from "../controllers/profile";
import { ViewTagsController } from "../controllers/setting";
import { AddTagsInterface, AddTagsController } from "../controllers/profile";
import { AppendFilesToFormData, AttachmentsInterface, FormatDate } from "../network-utils";
interface Experience {
    companyName: string | null;
    description: string | null;
    endDate: string | null;
    experience: string | null;
    startDate: string | null;
}

const experiences: Experience[] = [
    { companyName: null, description: null, endDate: null, experience: null, startDate: null }
];

async function ViewSocialProfile() {
    try {
        const response = await ViewSocialProfileController();
        return response;
    } catch (err) {
        throw err;
    };
};

async function AddSocialProfile(params: AddSocialProfileInterface) {
    try {
        const AddSocialProfileObject = {
            featuredMedia: [],
            userrefid: "",
            profsummary: params?.profsummary,
            businessExp: params?.businessExp,
            certifications: params?.certifications,
            socialMediaProfiles: params?.socialMediaProfiles
        }

        const formData = new FormData();
        formData.append('sprofile', JSON.stringify(AddSocialProfileObject));

        const response = await AddSocialProfileController(formData);
        return response;
    } catch (err) {
        throw err;
    }
}

async function GetPredefineTags() {
    try {
        const response = await GetPredefineTagsController();
        return response;
    } catch (err) {
        throw err;
    }
}

async function ViewTags() {
    try {
        const response = await ViewTagsController();
        return response;
    } catch (err) {
        throw err;
    }
}

async function AddTags(params: AddTagsInterface) {
    try {
        const response = await AddTagsController(params);
        return response;
    } catch (err) {
        throw err;
    }
}

async function AddProduct(params: AddProductInterface) {
    try {
        const ProductObject = {
            prodsystem: params.prodsystem,
            prodsubsystem: params.prodsubsystem,
            productname: params.productname,
            manufacturer: params.manufacturer,
            producttag: params.producttag.flat(Infinity)
        }

        const formData = new FormData();
        formData.append("product", JSON.stringify(ProductObject));
        AppendFilesToFormData(formData, params.attachments)

        const response = await AddProductController(formData);
        return response;
    } catch (error) {
        throw error;
    }
}

async function BuyerProfileInfo() {
    try {
        const response = await BuyerProfileInfoController();
        return response.data;       
    } catch (error) {
        throw error;
    }
}

export { ViewSocialProfile, AddSocialProfile, GetPredefineTags, ViewTags, AddTags, AddProduct, BuyerProfileInfo }