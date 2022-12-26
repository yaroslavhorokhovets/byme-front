import { BehaviorSubject } from 'rxjs';
import getConfig from 'next/config';
import { fetchWrapper } from 'helpers';

const { publicRuntimeConfig } = getConfig();
const pushNotificationEmailUrl = `${publicRuntimeConfig.apiUrl}/push/notification/email`;

export const PushNotificationEmailService = {
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
    return fetchWrapper.post(`${pushNotificationEmailUrl}`, {
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
    return fetchWrapper.put(`${pushNotificationEmailUrl}/${push_id}`, {
        description
    }).then(response => {
        return response;
    });
}

function deletePushNotification (push_id) {
    return fetchWrapper.delete(`${pushNotificationEmailUrl}/${push_id}`).then(response => {
        return response;
    });
}


function getPushNotification (page, per_page) {
    return fetchWrapper.get(`${pushNotificationEmailUrl}/?page=${page}&per_page=${per_page}`).then(response => {
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


