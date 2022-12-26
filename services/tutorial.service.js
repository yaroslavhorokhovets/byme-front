import { BehaviorSubject } from 'rxjs';
import getConfig from 'next/config';
import { fetchWrapper } from 'helpers';

const { publicRuntimeConfig } = getConfig();
const getTutorialFilesUrl = `${publicRuntimeConfig.apiUrl}/file/tutorial`;
const uploadTutorialFilesUrl = `${publicRuntimeConfig.apiUrl}/file/tutorial`;

export const tutorialService = {
    getTutorialFiles,
    uploadTutorialFiles,
};

function getTutorialFiles(format_tutorial, page, per_page) {
    return fetchWrapper.get(`${getTutorialFilesUrl}?format_tutorial=${format_tutorial}&page=${page}&per_page=${per_page}`)
        .then(response => {
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

function uploadTutorialFiles(format_tutorial, file) {
    return fetchWrapper.upload(`${uploadTutorialFilesUrl}?format_tutorial=${format_tutorial}`, file).then(response => {
        return response;
    });
}



