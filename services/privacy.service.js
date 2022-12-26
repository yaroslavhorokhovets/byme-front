import { BehaviorSubject } from "rxjs";
import getConfig from "next/config";
import { fetchWrapper } from "helpers";

const { publicRuntimeConfig } = getConfig();
const PrivacyUrl = `${publicRuntimeConfig.apiUrl}/privacy_policy`;
const TermUrl = `${publicRuntimeConfig.apiUrl}/terms_of_use`;

export const PrivacyService = {
    getPrivacy,
    getTerm,
    editPrivacy,
    editTerm,
};

function editPrivacy(description) {
    return fetchWrapper
        .put(`${PrivacyUrl}`, {
            description,
        })
        .then((response) => {
            return response;
        });
}

function editTerm(description) {
    return fetchWrapper
        .put(`${TermUrl}`, {
            description,
        })
        .then((response) => {
            return response;
        });
}

function getPrivacy() {
    return fetchWrapper.get(`${PrivacyUrl}`).then((response) => {
        return response;
    });
}

function getTerm() {
    return fetchWrapper.get(`${TermUrl}`).then((response) => {
        return response;
    });
}
