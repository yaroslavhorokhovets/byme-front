import { BehaviorSubject } from 'rxjs';
import getConfig from 'next/config';
import { fetchWrapper } from 'helpers';

const { publicRuntimeConfig } = getConfig();
const activityUrl = `${publicRuntimeConfig.apiUrl}/activity/history`;

export const ActivityService = {
    getActivityHistory,
    addActivityHistory
};

function getActivityHistory(year, month, page, per_page) {
    const url = `${activityUrl}?year=${year}&month=${month}&page=${page}&per_page=${per_page}`;
    return fetchWrapper.get(url).then(response => {
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

function addActivityHistory(device, description) {
    return fetchWrapper.post(activityUrl, {
        device,
        description
    }).then(response => {
       return response;
    });
}



