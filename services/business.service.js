import getConfig from 'next/config';
import { fetchWrapper, fetchGbpWrapper } from 'helpers';
import jwt_decode from "jwt-decode";
import '../pages/api/gapi.js';

const { publicRuntimeConfig } = getConfig();
var token = "";
const actionFilterUrl = `${publicRuntimeConfig.apiUrl}/business/accounts`;
const actionSaveUrl = `${publicRuntimeConfig.apiUrl}/business/store`;
const uploadGoogleUrl = `${publicRuntimeConfig.apiUrl}/business/upload`;
const actionGetUrl = `${publicRuntimeConfig.apiUrl}/business/get`;
const actionCloseUrl = `${publicRuntimeConfig.apiUrl}/business/delete`;
const getTutorialFilesUrl = `${publicRuntimeConfig.apiUrl}/file/tutorial`;
const uploadTutorialFilesUrl = `${publicRuntimeConfig.apiUrl}/file/tutorial`;
const readMask="storeCode,regularHours,name,languageCode,title,phoneNumbers,categories,storefrontAddress,websiteUri,regularHours,specialHours,serviceArea,labels,adWordsLocationExtensions,latlng,openInfo,metadata,profile,relationshipData,moreHours";
    
export const businessService = {
    start,
    signOut,
    changePassword,
    getBusinessAccounts,
    retrieveAccessTokenAndRefreshToken,
    retrieveAccessTokenFromRefreshToken,
    retrieveGoogleMyBusinessAccounts,
    getBusinessProfile,
    startInit,
    getReturnValue,
    getTutorialFiles,
    uploadTutorialFiles,
    uploadGoogleBusinessImage,
    uploadGoogleBusinessImageWithToken,
    updateFileGoogleStatus
};

let globalResult = {};

function getReturnValue(){
    return globalResult;
}



async function uploadGoogleBusinessImage(url, callback){
    
    let auth2;
    let result;
    gapi.load('auth2', async function () {

        auth2 = gapi.auth2.init({
            client_id: process.env.CLIENT_ID,
            scope: process.env.SCOPE,
            immediate: true,
            fetch_basic_profile: true,
            cookie_policy: 'single_host_origin',
            plugin_name: 'any_string_here'
        });

        auth2.grantOfflineAccess().then((authResult) => {
            var access_token = "";
            var id_token = "";
            if (authResult['code']) {                    
                retrieveAccessTokenAndRefreshToken(authResult['code']).then((response) => {
                    access_token = response.access_token;
                    id_token = response.id_token;
                    callback(retrieveGoogleMyBusinessImageUpload(access_token, url));
                });                            
            } else {
                result = {};
                callback(result)
            }
        });   

    });
}

async function uploadGoogleBusinessImageWithToken(access_token, url, callback){    
    callback(retrieveGoogleMyBusinessImageUpload(access_token, url));
}

async function startInit(callback) {
    let auth2;
    let result;
    gapi.load('auth2', async function () {

        auth2 = gapi.auth2.init({
            client_id: process.env.CLIENT_ID,
            scope: process.env.SCOPE,
            immediate: true,
            fetch_basic_profile: true,
            cookie_policy: 'single_host_origin',
            plugin_name: 'any_string_here'
        });

        auth2.grantOfflineAccess().then((authResult) => {
            var access_token = "";
            var refresh_token = "";
            var id_token = "";
            if (authResult['code']) {                    
                retrieveAccessTokenAndRefreshToken(authResult['code']).then((response) => {
                    access_token = response.access_token;
                    refresh_token = response.refresh_token;
                    id_token = response.id_token;
                    retrieveGoogleMyBusinessAccounts(access_token).then((accounts) => {
                        if(accounts.length > 0){
                            storeBusinessProfileStart(id_token, access_token, refresh_token).then((res) => {
                                if(res.code === 200){
                                    result = res.data;
                                    callback(result)
                                }else{
                                    result = {};
                                    callback(result)
                                }
                            });
                        }
                    });
                });                            
            } else {
                result = {};
                callback(result)
            }
        });   

    });
}

function storeBusinessProfileStart(id_token, access_token, refresh_token) {
    var decoded = jwt_decode(id_token);
    var data = {
        email: decoded.email,
        status: 1,
        name: decoded.name,
        family_name: decoded.family_name,
        given_name: decoded.given_name,
        email_verified: decoded.email_verified,
        iat: decoded.iat,
        sub: decoded.sub,
        exp: decoded.exp,
        aud: decoded.aud,
        azp: decoded.azp,
        jti: decoded.jti,
        nbf: decoded.nbf,
        iss: decoded.iss,
        picture: decoded.picture,
        access_token: access_token,
        refresh_token: refresh_token
    }
    
    return fetchWrapper.post(`${actionSaveUrl}`, data).then(response => {
        if (response.code == 200) {
            return response;
        } else {
            return {};
        }
    });
}

function updateFileGoogleStatus(image_id) {
    var data = {
        image_id: image_id,
        google_status: 1
    }
    return fetchWrapper.put(`${uploadGoogleUrl}`, data).then(response => {
        if (response.code == 200) {
            return response;
        } else {
            return {};
        }
    });
}


//WARNING: THIS FUNCTION IS DISPLAYED FOR DEMONSTRATION PURPOSES ONLY. YOUR CLIENT_SECRET SHOULD NEVER BE EXPOSED ON THE CLIENT SIDE!!!!
function retrieveAccessTokenAndRefreshToken(authCode) {
    var data = { // the headers passed in the request
        'code': authCode,
        'client_id': process.env.CLIENT_ID,
        'client_secret': process.env.CLIENT_SECRET,
        'redirect_uri': process.env.REDIRECT_URIS[0],
        'grant_type': "authorization_code"
    }
    return fetchGbpWrapper.post('https://www.googleapis.com/oauth2/v4/token', data).then(response => {
        if (response.expires_in > 0) {
            return response;
        } else {
            return {};
        }
    });
}

//WARNING: THIS FUNCTION IS DISPLAYED FOR DEMONSTRATION PURPOSES ONLY. YOUR CLIENT_SECRET SHOULD NEVER BE EXPOSED ON THE CLIENT SIDE!!!!
function retrieveAccessTokenFromRefreshToken(refreshToken) {
    var data = { // the headers passed in the request
        'refresh_token': refreshToken,
        'client_id': process.env.CLIENT_ID,
        'client_secret': process.env.CLIENT_SECRET,
        'redirect_uri': process.env.REDIRECT_URIS[0],
        'grant_type': 'refresh_token'
    }
    return fetchGbpWrapper.post('https://www.googleapis.com/oauth2/v4/token', data).then(response => {
        if (response.expires_in > 0) {
            return response;
        } else {
            return {};
        }
    });
}

function retrieveGoogleMyBusinessAccounts(accessToken) {
    return fetchGbpWrapper.get('https://mybusinessaccountmanagement.googleapis.com/v1/accounts', accessToken).then(response => {
        if (response.accounts.length > 0) {
            return response.accounts;
        } else {
            return {};
        }
    });
}

function retrieveGoogleMyBusinessLocations(accessToken, account_name) {
    return fetchGbpWrapper.get(`https://mybusinessbusinessinformation.googleapis.com/v1/${account_name}/locations?readMask=${readMask}`, accessToken).then(response => {
        if (response) {
            return response;
        } else {
            return {};
        }
    });
}

async function retrieveGoogleMyBusinessImageUpload(accessToken, requestUrl) {
    var account_name = "";
    retrieveGoogleMyBusinessAccounts(accessToken).then((accounts) => {
        if(accounts.length > 0){
            account_name = accounts[0].name;
            retrieveGoogleMyBusinessLocations(accessToken, account_name).then((response) => {
                if(response.locations){
                    let locationId = response.locations[0].name;
                    let url = `https://mybusiness.googleapis.com/v4/${account_name}/${locationId}/media`;
                    console.log(requestUrl)
                    console.log(url)
                    var data = {
                        "mediaFormat": "PHOTO",
                        "locationAssociation": {
                            "category": "COVER"
                        },
                        "sourceUrl": requestUrl,
                    }
                    return fetchGbpWrapper.post(url, data, accessToken).then(response => {
                        return (response===null)?{}:response;
                    });
                } else {
                    return {};
                }
            });
        } else {
            return {};
        }
    });

    
}

function signOut() {
    const url = `${actionCloseUrl}`;
    return fetchWrapper.delete(url).then(response => {
        if (response) {
            const results = {
                data: response.data
            };
            return results;
        } else {
            return {};
        }
    });
}
function changePassword() {
    console.log("changed")
}
function getBusinessProfile() {
    const url = `${actionGetUrl}`;
    return fetchWrapper.get(url).then(response => {
        if (response.code == 200) {
            const results = {
                data: response.data
            };
            return results;
        } else {
            return {};
        }
    });
}
///////////////////////////////////////////
function start() {
    window.google.accounts.id.initialize({
        client_id: process.env.CLIENT_ID,
        callback: onResponse,
        auto_select: false
    });
    google.accounts.id.prompt();

    return;
}
function getBusinessAccounts() {
    return fetchWrapper.get(`${actionFilterUrl}`, {}).then(response => {
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
function onResponse(credential) {
    token = credential.credential;
    var decoded = jwt_decode(token);
    var decodedHeader = jwt_decode(token, { header: true });
    var data = {
        email: decoded.email,
        status: 1,
        name: decoded.name,
        family_name: decoded.family_name,
        given_name: decoded.given_name,
        email_verified: decoded.email_verified,
        iat: decoded.iat,
        sub: decoded.sub,
        exp: decoded.exp,
        aud: decoded.aud,
        azp: decoded.azp,
        jti: decoded.jti,
        nbf: decoded.nbf,
        iss: decoded.iss,
        picture: decoded.picture
    }
    
    return fetchWrapper.post(`${actionSaveUrl}`, data).then(response => {
        if (response.code == 200) {
            const results = {
                data: response.data
            }
            return results;
        } else {
            return {};
        }
    });
}

///////////////////////////////////////////

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