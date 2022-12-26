import { BehaviorSubject } from 'rxjs';
import getConfig from 'next/config';
import { fetchWrapper } from 'helpers';

const { publicRuntimeConfig } = getConfig();
const randomImageUrl = `${publicRuntimeConfig.apiUrl}/random-choice-image-upload`;

export const LoadingService = {
    getRandomImages,
};

function getRandomImages() {
    return fetchWrapper.get(`${randomImageUrl}`).then(response => {
        if (response.code == 200) {
            const results = response.data?.lst_image;
            return results;
        } else {
            return {};
        }
    });
}

