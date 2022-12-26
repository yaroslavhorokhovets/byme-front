import { BehaviorSubject } from 'rxjs';
import getConfig from 'next/config';
import { fetchWrapper } from 'helpers';

const { publicRuntimeConfig } = getConfig();

const actionFilterUrl = `${publicRuntimeConfig.apiUrl}/account/actions/filter`;
const actionDownloadCSVUrl = `${publicRuntimeConfig.apiUrl}/account/actions/download-csv`;

export const AccountService = {
    getAccountActionFilter,
    getAccountActionDownloadCSV
};

function getAccountActionFilter(search, code_user, page, per_page) {
    return fetchWrapper.post(`${actionFilterUrl}?page=${page}&per_page=${per_page}`, {
        search,
        code_user
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

function getAccountActionDownloadCSV(search, code_user, start_time, end_time) {
    return fetchWrapper.post(`${actionDownloadCSVUrl}`, {
        search,
        code_user,
        start_time,
        end_time
    }).then(response => {
       return response;
    });
}

