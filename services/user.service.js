import { BehaviorSubject } from 'rxjs';
import getConfig from 'next/config';
import Router from 'next/router'

import { fetchWrapper } from 'helpers';

const { publicRuntimeConfig } = getConfig();
const baseLoginUrl = `${publicRuntimeConfig.apiUrl}/login`;
const recoveryUrl = `${publicRuntimeConfig.apiUrl}/email/send-mail-reset-password`;

const resetPasswordUrl = `${publicRuntimeConfig.apiUrl}/reset-password`;
const baseAccountUrl = `${publicRuntimeConfig.apiUrl}/account`;
const updateAccountUrl = `${publicRuntimeConfig.apiUrl}/account`;

const registerAccountUrl = `${publicRuntimeConfig.apiUrl}/register`;

const userSubject = new BehaviorSubject(process.browser && JSON.parse(localStorage.getItem('user')));

export const userService = {
    user: userSubject.asObservable(),
    get userValue () { return userSubject.value },
    login,
    logout,
    recovery,
    resetPassword,
    getAll,
    updateAccount,
    updateAccountUser,
    updatePasswordAccount,
    register
};

function login(username, password) {
    return fetchWrapper.post(`${baseLoginUrl}`, { username, password })
        .then(user => {
            // publish user to subscribers and store in local storage to stay logged in between page refreshes
            userSubject.next(user);
            localStorage.setItem('user', JSON.stringify(user));

            return user;
        });
}

function logout() {
    // remove user from local storage, publish null to user subscribers and redirect to login page
    localStorage.removeItem('user');
    userSubject.next(null);
    Router.push('/login');
}

function recovery(email) {
    return fetchWrapper.post(`${recoveryUrl}`, { email })
        .then(response => {
            return response;
        });
}

function resetPassword(email, request_code, code, new_password ) {
    return fetchWrapper.post(`${resetPasswordUrl}`, { email, request_code, code, new_password })
        .then(response => {
            return response;
        });
}

function register(
    facility_name,
    facility_code,
    sales_staff,
    password,
    representative_name,
    email,
    postal_code,
    address,
    phone_number,
    fax_number,
    ID_use,
    type_base,
    lst_buy,
    price,
    annual_usage_fee,
    instant_delivery_request_fee,
    permission
) {
    return fetchWrapper.post(`${registerAccountUrl}`, {
        facility_name,
        facility_code,
        sales_staff,
        password,
        representative_name,
        email,
        postal_code,
        address,
        phone_number,
        fax_number,
        ID_use,
        type_base,
        lst_buy,
        price,
        annual_usage_fee,
        instant_delivery_request_fee,
        permission
    })
    .then(response => {
        return response;
    });
}

function updateAccount(
    facility_name,
    facility_code,
    sales_staff,
    password,
    representative_name,
    email,
    postal_code,
    address,
    phone_number,
    fax_number,
    ID_use,
    type_base,
    lst_buy,
    price,
    annual_usage_fee,
    instant_delivery_request_fee,
    permission
) {
    return fetchWrapper.put(`${updateAccountUrl}/${account_id}`, {
        facility_name,
        facility_code,
        sales_staff,
        password,
        representative_name,
        email,
        postal_code,
        address,
        phone_number,
        fax_number,
        ID_use,
        type_base,
        lst_buy,
        price,
        annual_usage_fee,
        instant_delivery_request_fee,
        permission
    }).then(response => {
        return response;
    });
}

function updateAccountUser(
    account_id,
    facility_code,
    password,
    representative_name,
    email,
    address
) {
    return fetchWrapper.put(`${updateAccountUrl}/${account_id}`, {
        facility_code,
        password,
        representative_name,
        email,
        address
    }).then(response => {
        return response;
    });
}

function updatePasswordAccount(account_id, password, email) {
    console.log(`updatePasswordAccount`, account_id);
    return fetchWrapper.put(`${updateAccountUrl}/${account_id}`, {
        password,
        email,
    }).then(response => {
        return response;
    });
}

function getAll() {
    return fetchWrapper.get(baseAccountUrl);
}
