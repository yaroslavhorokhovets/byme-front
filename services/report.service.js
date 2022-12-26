import { BehaviorSubject } from 'rxjs';
import getConfig from 'next/config';
import { fetchWrapper } from 'helpers';

const { publicRuntimeConfig } = getConfig();
const reportUrl = `${publicRuntimeConfig.apiUrl}/report`;
const reportAdminUrl = `${publicRuntimeConfig.apiUrl}/report-admin`;

export const reportService = {
    getReports,
    getAdminReports,
};
function getReports(start_time, end_time) {
    return fetchWrapper.get(`${reportUrl}?start_time=${start_time}&end_time=${end_time}`)
        .then(response => {
            console.log('function getReports ->>  :::: ',response );
            return response;
        });
}

function getAdminReports(start_time, end_time) {
    return fetchWrapper.get(`${reportAdminUrl}?start_time=${start_time}&end_time=${end_time}`)
        .then(response => {
            console.log('function getAdminReports ->>  :::: ',response );
            return response;
        });
}

