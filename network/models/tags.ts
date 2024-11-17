import { GetPredefinedTagsByCategoryController, GetUserTagsController, UpdateUserTagsController, UpdateUserTagsInterface } from "../controllers/tags";

interface Tag { tagid: number, categoryname: string, subcategoryname: string, tagname: string, addedby: number }
interface SortedTags { products: Tag[], services: Tag[], locations: Tag[], industries: Tag[] }

interface SortedUserTags { buyingTags: SortedTags, sellingTags: SortedTags }

function SortUserTags(tags: Tag[]) {
    const sortedTags: SortedUserTags = {
        buyingTags: {
            products: [],
            services: [],
            locations: [],
            industries: []
        },
        sellingTags: {
            products: [],
            services: [],
            locations: [],
            industries: []
        }
    };

    tags.forEach((tag) => {
        switch (tag.categoryname) {
            case 'products':
                tag.subcategoryname === 'buying' ? sortedTags.buyingTags.products.push(tag) : sortedTags.sellingTags.products.push(tag);
                break;
            case 'services':
                tag.subcategoryname === 'buying' ? sortedTags.buyingTags.services.push(tag) : sortedTags.sellingTags.services.push(tag);
                break;
            case 'territories':
                tag.subcategoryname === 'buying' ? sortedTags.buyingTags.locations.push(tag) : sortedTags.sellingTags.locations.push(tag);
                break;
            case 'industries':
                tag.subcategoryname === 'buying' ? sortedTags.buyingTags.industries.push(tag) : sortedTags.sellingTags.industries.push(tag);
                break;
        }
    });

    return sortedTags;
}

async function GetSortedPredefinedTags() {
    try {
        const productTags = await GetPredefinedTagsByCategoryController('products');
        const serviceTags = await GetPredefinedTagsByCategoryController('services');
        const locationTags = await GetPredefinedTagsByCategoryController('territories');
        const industryTags = await GetPredefinedTagsByCategoryController('industries');

        const sortedTags: SortedTags = { products: productTags, services: serviceTags, locations: locationTags, industries: industryTags };
        return sortedTags;
    }
    catch (error) {
        throw error;
    }
}

async function GetSortedUserTags() {
    try {
        const tags = await GetUserTagsController();
        return SortUserTags(tags);
    }
    catch (error) {
        throw error;
    }
}

async function UpdateUserTags(params: UpdateUserTagsInterface) {
    try {
        const modifiedTagList = params.tagslist.map((tag) => {
            return {
                tagid: tag.tagid,
                categoryname: tag.categoryname,
                subcategoryname: tag.subcategoryname,
                tagname: tag.tagname,
                associateid: tag.addedby || tag.associateid
            };
        }); // TODO: Shouldn't be required, but the API is expecting this format

        const response = await UpdateUserTagsController({ tagslist: modifiedTagList, userrefid: params.userrefid });
        return response;
    }
    catch (error) {
        throw error;
    }
}

export { GetSortedPredefinedTags, GetSortedUserTags, UpdateUserTags };