import React, {useEffect, useState, useCallback} from "react";
import IconSvg from "components/icon/";
import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import {useForm} from "react-hook-form";

import moment from 'moment';
import InputDateTime from '../input-datetime/input-datetime'
import { ActivityService, InvoicesService } from '../../services'
import * as Notification from "../../modules/Notification";

const PopupInvoiceEdit = props => {
    const { t, invoice, isOpen, handleClosePopup, handleCancel } = props;

    // schema form
    const validationSchema = yup.object().shape({
        invoice_input_username: yup.string().required(t('input_valid_empty')),
        invoice_input_big_project: yup.string().required(t('input_valid_empty')),
        invoice_input_small_project: yup.string().required(t('input_valid_empty')),
        invoice_input_quantity: yup.string()
            .required(t('input_valid_empty')),
        invoice_input_account_bank: yup.string().required(t('input_valid_empty')),
        invoice_input_branch: yup.string().required(t('input_valid_empty')),
        invoice_input_payee: yup.number()
            .required(t('input_valid_empty'))
            .typeError(t('input_number_valid_empty')),
    });

    const formOptions = { mode: 'onBlur',resolver: yupResolver(validationSchema) };

    // get functions to build form with useForm() hook
    const { register, handleSubmit, setError, formState } = useForm(formOptions);
    const { errors } = formState;
    
    // the parentState will be set by its child slider component
    const [dayRequest, setDayRequest] = useState(null);
    const handleDateRequestChange = (date) => {
        setDayRequest(date);
    }

    const [dayTranfer, setDayTranfer] = useState(null);
    const handleDateTranferChange = (date) => {
        setDayTranfer(date);
    }

    const [success, setSuccess] = useState(null);
    const onSubmit = ({
                          invoice_input_username, 
                          invoice_input_big_project, 
                          invoice_input_small_project,
                          invoice_input_quantity,
                          invoice_input_account_bank,
                          invoice_input_branch,
                          invoice_input_payee
    }) => {
        
        InvoicesService.editInvoice(
            invoice?._id,
            invoice_input_username,
            dayRequest,
            dayTranfer,
            invoice_input_big_project,
            invoice_input_small_project,
            invoice_input_quantity,
            invoice_input_account_bank,
            invoice_input_branch,
            invoice_input_payee
        ).then(response => {
            ActivityService.addActivityHistory('Web', t('msg_request_edit_success'));
            // console.log(`InvoicesService editInvoice: `, response);
            const message = `${t('msg_request_edit_success')}`;
            Notification.success(message);
        }).catch(error => {
            // setError('apiError', { message: error.message || error });
            Notification.error(error.message);
        });
        
        return true;
    }

    useEffect(() => {
        setTimeout(() => setSuccess(null), 5000)

        
        const close = (e) => {
            if (e.keyCode === 27) {
                handleClosePopup(e);
            }
        }
        window.addEventListener('keydown', close)
        return () => window.removeEventListener('keydown', close)
    });

    return (
        <div className={`popup__list popup__list--invoice-edit ${isOpen ? 'active': ''}`}>
            <div className={`popup__item relative ${isOpen ? 'active': ''}`}>
                <div className="popup__item-inner">
                    <div className="popup__close f jce aic" onClick={e => handleClosePopup(e)}>
                        <IconSvg icon='close' />
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="popup__content">
                            <h4 className="popup__title">{t('notice_popup_edit_tile')}</h4>
                            {errors.apiError &&
                            <div className="text-danger error-service align-c mb-4">{errors.apiError?.message}</div>
                            }
                            {success &&
                            <div className="text-success align-c mb-4">{success?.message}</div>
                            }
                            
                            <div className="form-group">
                                <label className="form-label" htmlFor="invoice_username_label">{t('invoice_input_username_label')}</label>
                                <div className="form-value">
                                    <input 
                                        type="text"
                                        id="invoice_input_username"
                                        className="form-control"
                                        {...register('invoice_input_username')}
                                        defaultValue={invoice?.username}
                                        placeholder={t('invoice_input_username_placeholder')} 
                                    />
                                    <div className="text-danger">{errors.invoice_input_username?.message}</div>
                                </div>
                            </div>
                            
                            <div className="form-half">
                                <div className="form-group">
                                    <label className="form-label" htmlFor="invoice_input_day_request_label">{t('invoice_input_day_request_label')}</label>
                                    <div className="form-value">
                                        <InputDateTime
                                            date={dayRequest == null ? invoice?.day_request : dayRequest}
                                            handleChange={handleDateRequestChange.bind(this)} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="invoice_input_day_transfer_label">{t('invoice_input_day_transfer_label')}</label>
                                    <div className="form-value">
                                        <InputDateTime
                                            date={dayTranfer == null ? invoice?.day_transfer : dayTranfer}
                                            handleChange={handleDateTranferChange.bind(this)} />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="form-half">
                                <div className="form-group">
                                    <label className="form-label" htmlFor="invoice_input_big_project_label">{t('invoice_input_big_project_label')}</label>
                                    <div className="form-value">
                                        <input
                                            type="text"
                                            id="invoice_input_big_project"
                                            className="form-control"
                                            {...register('invoice_input_big_project')}
                                            defaultValue={invoice?.big_project}
                                            placeholder={t('invoice_input_big_project_placeholder')}
                                        />
                                        <div className="text-danger">{errors.invoice_input_big_project?.message}</div>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="invoice_input_small_project_label">{t('invoice_input_small_project_label')}</label>
                                    <div className="form-value">
                                        <input
                                            type="text"
                                            id="invoice_input_small_project"
                                            className="form-control"
                                            {...register('invoice_input_small_project')}
                                            defaultValue={invoice?.small_project}
                                            placeholder={t('invoice_input_small_project_placeholder')}
                                        />
                                        <div className="text-danger">{errors.invoice_input_small_project?.message}</div>
                                    </div>
                                </div>
                            </div>
                          
                            <div className="form-half">
                                <div className="form-group">
                                    <label className="form-label" htmlFor="invoice_input_quantity_label">{t('invoice_input_quantity_label')}</label>
                                    <div className="form-value">
                                        <input
                                            type="text"
                                            id="invoice_input_quantity"
                                            className="form-control"
                                            {...register('invoice_input_quantity')}
                                            defaultValue={invoice?.quantity}
                                            placeholder={t('invoice_input_quantity_placeholder')}
                                        />
                                        <div className="text-danger">{errors.invoice_input_quantity?.message}</div>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="invoice_input_account_bank_label">{t('invoice_input_account_bank_label')}</label>
                                    <div className="form-value">
                                        <input
                                            type="text"
                                            id="invoice_input_account_bank"
                                            className="form-control"
                                            {...register('invoice_input_account_bank')}
                                            defaultValue={invoice?.account_bank}
                                            placeholder={t('invoice_input_account_bank_placeholder')}
                                        />
                                        <div className="text-danger">{errors.invoice_input_account_bank?.message}</div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="form-half">
                                <div className="form-group">
                                    <label className="form-label" htmlFor="invoice_input_branch_label">{t('invoice_input_branch_label')}</label>
                                    <div className="form-value">
                                        <input
                                            type="text"
                                            id="invoice_input_branch"
                                            className="form-control"
                                            {...register('invoice_input_branch')}
                                            defaultValue={invoice?.branch}
                                            placeholder={t('invoice_input_branch_placeholder')}
                                        />
                                        <div className="text-danger">{errors.invoice_input_branch?.message}</div>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="invoice_input_payee_label">{t('invoice_input_payee_label')}</label>
                                    <div className="form-value">
                                        <input
                                            type="text"
                                            id="invoice_input_payee"
                                            className="form-control"
                                            {...register('invoice_input_payee')}
                                            defaultValue={invoice?.payee}
                                            placeholder={t('invoice_input_payee_placeholder')}
                                        />
                                        <div className="text-danger">{errors.invoice_input_payee?.message}</div>
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                        <div className="popup__actions f jcc aic">
                            <button type="button" className="popup__btn-save btn btn-default btn--no-shadow btn--small" onClick={e=> handleCancel(e)}>{t('btn_cancel')}</button>
                            <button type="submit" className="popup__btn-download btn btn-gradient btn--no-shadow btn--small">{t('btn_save')}</button>
                        </div>
                    </form>
                </div>
            </div>
            <div className={`popup__overlay ${isOpen ? 'active': ''}`}></div>
        </div>
    );
}

export default PopupInvoiceEdit;