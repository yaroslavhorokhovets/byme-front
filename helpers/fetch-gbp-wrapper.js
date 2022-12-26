import * as Notification from '../modules/Notification'
import { userService } from 'services';

export const fetchGbpWrapper = {
    get,
    post,
    put,
    upload,
    delete: _delete
};

function get(url, token) {
    const requestOptions = {
        method: 'GET',
        headers: { 
            'Content-Type': 'application/json',
            ...authHeader(token) 
        },
    };
    return fetch(
        url, 
        requestOptions,
    ).then(handleResponse);
}

function post(url, body, token) {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...authHeader(token) 
        },
        body: JSON.stringify(body)
    };

    console.log(requestOptions);

    return fetch(
        url,
        requestOptions,
    ).then(handleResponse);
}

function upload(url, formData, token) {
    const requestOptions = {
        method: 'POST',
        headers: {
            // 'Content-Type': 'multipart/form-data',
            ...authHeader(token)
        },
        credentials: 'omit',
        body: formData
    };
    return fetch(
        url,
        requestOptions,
    ).then(handleResponse);
}

function put(url, body, token) {
    const requestOptions = {
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json', 
            ...authHeader(token) 
        },
        body: JSON.stringify(body)
    };
    return fetch(url, requestOptions).then(handleResponse);
}

// prefixed with underscored because delete is a reserved word in javascript
function _delete(url, token) {
    const requestOptions = {
        method: 'DELETE',
        headers: authHeader(token)
    };
    return fetch(url, requestOptions).then(handleResponse);
}

// helper functions

function authHeader(token) {
    if (token) {
        return { 'Authorization': `Bearer ${token}` };
    } else {
        return {};
    }
}

function handleResponse(response) {
    console.log(response);
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        console.log(data);
        // return data;
        if (!response.ok) {
            if ([4011, 403, 400].includes(response.status) && userService.userValue) {
                // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
                userService.logout();
            }
            
            if ([401].includes(response.status) && userService.userValue) {
                // console.log(response);
                Notification.error(response.status + ' User no permission.');
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}