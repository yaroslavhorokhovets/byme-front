/* eslint no-useless-escape: 0 */
import Base64 from 'hi-base64';
import Cookies from 'universal-cookie';
import moment from "moment";

export const setCookie = (key, value, option) => {
    let cookies = new Cookies();
    cookies.set(key, value, option);
};

export const getCookie = (key) => {
    let cookies = new Cookies();
    return cookies.get(key);
};

export const removeCookie = (key, option) => {
    let cookies = new Cookies();
    cookies.remove(key, option);
};

export const parseToken = (accessToken) => {
    if (accessToken === undefined) {
        return null;
    }
    let parts = accessToken.split('.');
    if (parts.length !== 3) {
        return null; // token seems to be invalid
    }

    return JSON.parse(Base64.decode(parts[1]));
};

export function numberWithCommas(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function parseQuery() {
    let regex = /[?&]([^=#]+)=([^&#]*)/g,
        url = window.location.href,
        params = {},
        match;

    while (true) {
        match = regex.exec(url);
        if (match) {
            params[match[1]] = match[2];
        } else {
            break;
        }
    }

    return params;
}
export const formatDateFullHour = (date) => {
    return moment(date).format("DD/MM/YYYY HH:mm:ss");
};

export const formatDate = (date) => {
    return moment(date).format("DD/MM/YYYY");
};

export const empty = (string) => {
    return (undefined === string) || (null === string) || (0 === string.trim().length);
}

export const formatDateTime = (timestamp) =>{
    let datetime = new Date(new Number(timestamp));
    return moment(datetime).format("HH:mm DD/MM/YYYY");
}

export const withValueCap = (inputObj) => {
    const MAX_VAL = 999999999999999;
    const { value } = inputObj;
    if (value <= MAX_VAL) return true;
    return false;
};

export const isNumeric = (value) => {
    return /^-?\d+$/.test(value) || /^\d+\.\d+$/.test(value);
}

export function validEmail(email) {
    let re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}