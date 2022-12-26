import {NotificationManager} from 'react-notifications';
import toastr from "toastr";

export const success = (message, options) => {
    if (options) {
        toastr.options = options;
    } else {
        toastr.options = {
            positionClass: "toast-top-right",
            timeOut: 1000,
            closeButton: false,
        };
    }
    toastr.success(message);
};

export const info = (message, options) => {
    if (options) {
        toastr.options = options;
    } else {
        toastr.options = {
            positionClass: "toast-top-right",
            timeOut: 1000,
            closeButton: false,
        };
    }

    toastr.info(message);
};

export const warning = (message, options) => {
    if (options) {
        toastr.options = options;
    } else {
        toastr.options = {
            positionClass: "toast-top-right",
            timeOut: 1000,
            closeButton: false,
        };
    }

    toastr.warning(message);
};

export const error = (message, options) => {
    if (options) {
        toastr.options = options;
    } else {
        toastr.options = {
            positionClass: "toast-top-right",
            timeOut: 1000,
            closeButton: false,
        };
    }

    toastr.error(message);
};