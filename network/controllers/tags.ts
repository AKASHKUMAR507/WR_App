import { Request } from '../network';

interface UpdateUserTagsInterface { tagslist: any[], userrefid: string }

async function GetPredefinedTagsByCategoryController(category: string) {
    const url = `user/action/getpredeftags/${category}`;

    try {
        const response = await Request('GET', url);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

async function GetUserTagsController() {
    const url = '/user/action/viewtags';

    try {
        const response = await Request('GET', url);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

async function UpdateUserTagsController(params: UpdateUserTagsInterface) {
    const url = '/user/action/addtags';

    try {
        const response = await Request('POST', url, params);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

export type { UpdateUserTagsInterface };
export { GetPredefinedTagsByCategoryController, GetUserTagsController, UpdateUserTagsController };