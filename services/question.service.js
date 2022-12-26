import { BehaviorSubject } from 'rxjs';
import getConfig from 'next/config';
import { fetchWrapper } from 'helpers';

const { publicRuntimeConfig } = getConfig();
const questionUrl = `${publicRuntimeConfig.apiUrl}/questions`;

export const questionService = {
    question,
};

function question(fullname, email, question) {
    return fetchWrapper.post(`${questionUrl}`, {
        fullname,
        email,
        question,
    }).then(response => {
        if (response.code == 200) {
            return response;
        } else {
            return {};
        }
    });
}



