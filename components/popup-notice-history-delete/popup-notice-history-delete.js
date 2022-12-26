import React, {useEffect} from "react";
import IconSvg from "components/icon/";
import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import {useForm} from "react-hook-form";

const PopupNoticeHistoryDelete = props => {
    const { t, isOpen, msg, handleClosePopup, handleRequestSubmit, handleCancel } = props;

    useEffect(() => {
        const close = (e) => {
            if (e.keyCode === 27) {
                handleClosePopup(e);
            }
        }
        window.addEventListener('keydown', close)
        return () => window.removeEventListener('keydown', close)
    });

    return (
        <div className={`popup__list popup__list--line ${isOpen ? 'active': ''}`}>
            <div className={`popup__item relative ${isOpen ? 'active': ''}`}>
                <div className="popup__item-inner">
                    <div className="popup__close f jce aic" onClick={e => handleClosePopup(e)}>
                        <IconSvg icon='close' />
                    </div>

                    <div className="popup__content">
                        <h4 className="popup__title">{t('notice_popup_delete_tile')}</h4>
                        <p>{t('notice_popup_delete_content')}</p>
                    </div>

                    {msg?.error &&
                    <div className="text-danger error-service align-l mb-2">{msg?.error}</div>
                    }
                       
                    <div className="popup__actions f jcc aic">
                        <button type="button" className="popup__btn-save btn btn-default btn--no-shadow btn--small" onClick={e => handleCancel(e)}>{t('btn_cancel')}</button>
                        <button type="submit" className="popup__btn-download btn btn-gradient btn--no-shadow btn--small" onClick={e => handleRequestSubmit(e)}>{t('btn_delete')}</button>
                    </div>
                </div>
            </div>
            <div className={`popup__overlay ${isOpen ? 'active': ''}`}></div>
        </div>
    );
}

export default PopupNoticeHistoryDelete;