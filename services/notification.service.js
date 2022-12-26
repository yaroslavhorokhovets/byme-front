import { BehaviorSubject } from 'rxjs';
import getConfig from 'next/config';
import { fetchWrapper } from 'helpers';

const { publicRuntimeConfig } = getConfig();
const pushNotificationUrl = `${publicRuntimeConfig.apiUrl}/push/notification/web`;

export const PushNotificationService = {
    addPushNotification,
    getPushNotification,
    editPushNotification,
    deletePushNotification,
};

function addPushNotification (
    action_time,
    title,
    url,
    description
) {
    return fetchWrapper.post(`${pushNotificationUrl}`, {
        action_time,
        title,
        url,
        description
    }).then(response => {
        return response;
    });
}

function editPushNotification (
    push_id,
    description
) {
    return fetchWrapper.put(`${pushNotificationUrl}/${push_id}`, {
        description
    }).then(response => {
        return response;
    });
}

function deletePushNotification (push_id) {
    return fetchWrapper.delete(`${pushNotificationUrl}/${push_id}`).then(response => {
        return response;
    });
}


function getPushNotification (page, per_page) {
    return fetchWrapper.get(`${pushNotificationUrl}/?page=${page}&per_page=${per_page}`).then(response => {
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


