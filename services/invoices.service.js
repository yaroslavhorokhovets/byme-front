import { BehaviorSubject } from 'rxjs';
import getConfig from 'next/config';
import { fetchWrapper } from 'helpers';

const { publicRuntimeConfig } = getConfig();
const invoicesUrl = `${publicRuntimeConfig.apiUrl}/invoices`;
const editInvoiceUrl = `${publicRuntimeConfig.apiUrl}/invoice`;
const downloadInvoiceUrl = `${publicRuntimeConfig.apiUrl}/download/invoices`;
const downloadInvoiceUserUrl = `${publicRuntimeConfig.apiUrl}/download/invoices/user`;
const uploadInvoiceUrl = `${publicRuntimeConfig.apiUrl}/upload/invoices`;

export const InvoicesService = {
    getInvoices,
    editInvoice,
    downloadInvoice,
    downloadInvoiceUser,
    uploadInvoice
};

function downloadInvoice(invoice_ids) {
    return fetchWrapper.post(`${downloadInvoiceUrl}`, {invoice_ids}).then(response => {
        return response;
    });
}

function downloadInvoiceUser() {
    return fetchWrapper.post(`${downloadInvoiceUserUrl}`).then(response => {
        return response;
    });
}

function uploadInvoice(file) {
    return fetchWrapper.upload(`${uploadInvoiceUrl}`, file).then(response => {
        return response;
    });
}

function getInvoices(action_time, page, per_page) {
    return fetchWrapper.get(`${invoicesUrl}?action_time=${action_time}&page=${page}&per_page=${per_page}`).then(response => {
        if (response.code == 200) {
            const results = {
                list: response.data.list,
                total: response.data.total,
                page: response.page
            }
            return results;
        } else {
            return {};
        }
    });
}

function editInvoice(
    invoice_id,
    username,
    day_request,
    day_transfer,
    big_project,
    small_project,
    quantity,
    account_bank,
    branch,
    payee
) {
    return fetchWrapper.put(`${editInvoiceUrl}/${invoice_id}`, {
        username,
        day_request,
        day_transfer,
        big_project,
        small_project,
        quantity,
        account_bank,
        branch,
        payee
    }).then(response => {
        return response;
    });
}
