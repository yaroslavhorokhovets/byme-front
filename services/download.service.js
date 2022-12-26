import { BehaviorSubject } from 'rxjs';
import getConfig from 'next/config';
import { fetchWrapper } from 'helpers';

const { publicRuntimeConfig } = getConfig();
const downloadImageUrl = `${publicRuntimeConfig.apiUrl}/download/image`;
const photoRequestEditUrl = `${publicRuntimeConfig.apiUrl}/image/request/edit`;

export const downloadService = {
    downloadImage,
    photoRequestEdit
};

function downloadImage(ratio, image_ids) {
    return fetchWrapper.post(`${downloadImageUrl}`, {
        ratio,
        image_ids, // add type = history for screen Image History
    }).then(response => {
        if (response.code == 200) {
            const results = {
                data: response.data,
                message: response.message
            }
            return results;
        } else {
            return {};
        }
    });
}

function photoRequestEdit(image_ids, note) {
    console.log('image_ids : ', image_ids);
    console.log('note : ', note);
    return fetchWrapper.post(`${photoRequestEditUrl}`, {
        image_ids,
        note, // add type = history for screen Image History
    }).then(response => {
        if (response.code == 200) {
            const results = {
                code: response.code,
                data: response.data,
                message: response.message
            }
            return results;
        } else {
            return {};
        }
    });
}



