import React, {useEffect, useState} from "react";
import IconSvg from "components/icon/";
import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import {useForm} from "react-hook-form";
import { ActivityService, InvoicesService } from '../../services'

const PopupNoticeHistoryEdit = props => {
    const { t, item, msg, isOpen, handleClosePopup, handleRequestSubmit, handleCancel } = props;
    // console.log(`item : `, item);
    // schema form
    const validationSchema = yup.object().shape({
        description: yup.string().required(t('post_history_content_valid_empty')),
    });

    const formOptions = { mode: 'onBlur',resolver: yupResolver(validationSchema) };

    // get functions to build form with useForm() hook
    const { register, handleSubmit, reset, setError, formState } = useForm(formOptions);
    const { errors } = formState;

    useEffect(() => {
        const close = (e) => {
            if (e.keyCode === 27) {
                handleClosePopup(e);
            }
        }
        window.addEventListener('keydown', close)
        return () => window.removeEventListener('keydown', close)
    });


    useEffect(() => {
        // reset form with user data
        reset(item);
    }, [item]);


    return (
        <div className={`popup__list popup__list--line ${isOpen ? 'active': ''}`}>
            <div className={`popup__item relative ${isOpen ? 'active': ''}`}>
                <div className="popup__item-inner">
                    <div className="popup__close f jce aic" onClick={e => handleClosePopup(e)}>
                        <IconSvg icon='close' />
                    </div>
                    <form onSubmit={handleSubmit(handleRequestSubmit)}>
                        <div className="popup__content">
                            <h4 className="popup__title">{t('notice_popup_edit_tile')}</h4>
                            {msg?.error &&
                            <div className="text-danger error-service align-l mb-2">{msg?.error}</div>
                            }
                            {msg?.success &&
                            <div className="text-success align-l mb-2">{msg?.success}</div>
                            }
                            <div className="form-group">
                                <label className="form-label" htmlFor="post_history_content_label">{t('post_history_content_label')}</label>
                                <div className="form-value">
                                    <textarea type="text"
                                            id="post_history_content"
                                            className="form-control"
                                            {...register('description')}
                                            placeholder={t('post_history_content_placeholder')} rows="4">
                                    </textarea>
                                    <div className="text-danger">{errors.description?.message}</div>
                                </div>
                            </div>
                        </div>
                        <div className="popup__actions f jcc aic">
                            <button type="button" className="popup__btn-save btn btn-default btn--no-shadow btn--small" onClick={e => handleCancel(e)}>{t('btn_cancel')}</button>
                            <button type="submit" className="popup__btn-download btn btn-gradient btn--no-shadow btn--small">{t('btn_save')}</button>
                        </div>
                    </form>
                </div>
            </div>
            <div className={`popup__overlay ${isOpen ? 'active': ''}`}></div>
        </div>
    );
}

export default PopupNoticeHistoryEdit;