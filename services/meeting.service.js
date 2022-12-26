import { BehaviorSubject } from 'rxjs';
import getConfig from 'next/config';
import { fetchWrapper } from 'helpers';

const { publicRuntimeConfig } = getConfig();
const requestMettingUrl = `${publicRuntimeConfig.apiUrl}/request-meeting`;

export const meetingService = {
    requestMetting,
};

function requestMetting(facility_name, person_charge, phone_number, email, desired_schedule) {
    return fetchWrapper.post(`${requestMettingUrl}`, { 
        facility_name, 
        person_charge, 
        phone_number, 
        email, 
        desired_schedule 
    }).then(response => {
        if (response.code == 200) {
            const results = {
                data: response.data,
                message: response.message
            }
            return results;
        } else {
            return {};
        }
    });
}



