import { BehaviorSubject } from 'rxjs';
import getConfig from 'next/config';
import { fetchWrapper } from 'helpers';

const { publicRuntimeConfig } = getConfig();
const filterImageUrl = `${publicRuntimeConfig.apiUrl}/image/request/history`;

export const ImageService = {
    getFilterImages,
    getFilterImagesByChildCategory,
};

function getFilterImages(tab, page, per_page, account_ids, start_time, end_time) {
    const url = `${filterImageUrl}?tab=${tab}&page=${page}&per_page=${per_page}`;
    return fetchWrapper.post(url, {
        account_ids, start_time, end_time
    }).then(response => {
        if (response.code == 200) {
            const results = {
                data: response.data,
                page: response.page
            }
            return results;
        } else {
            return {};
        }
    });
}

function getFilterImagesByChildCategory(root_category_id, child_id, type_query, account_ids, start_time, end_time, page, per_page) {
    const url = `${publicRuntimeConfig.apiUrl}/${root_category_id}/child/actions/filter/image?page=${page}&per_page=${per_page}`;
    
    return fetchWrapper.post(url, { child_id, type_query, account_ids, start_time, end_time }).then(response => {
        if (response.code == 200) {
            const results = {
                data: response.data,
                page: response.page
            }
            return results;
        } else {
            return {};
        }
    });
}



