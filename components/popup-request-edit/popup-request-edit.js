import React, {useEffect} from "react";
import IconSvg from "components/icon/";
import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import {useForm} from "react-hook-form";

const PopupRequestEdit = props => {
    const { t, isAdmin, data, msg, isOpen, handleClosePopup, handleRequestEdit, handleCancelEdit } = props;

    // schema form
    const validationSchema = yup.object().shape({
        note: yup.string().required(t('photo_note_valid_empty'))
    }); 

    const formOptions = { mode: 'onBlur',resolver: yupResolver(validationSchema) };

    // get functions to build form with useForm() hook
    const { register, handleSubmit, reset, setError, formState } = useForm(formOptions);
    const { errors } = formState;

    useEffect(() => {
        reset(data);
    }, [data]);

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
        <div className={`popup__list popup__list--request-edit ${isOpen ? 'active': ''}`}>
            <div className={`popup__item relative ${isOpen ? 'active': ''}`}>
                <div className="popup__item-inner">
                    <div className="popup__close f jce aic" onClick={e => handleClosePopup(e)}>
                        <IconSvg icon='close' />
                    </div>
                    <form onSubmit={handleSubmit(handleRequestEdit)}>
                        <div className="popup__content">
                            <h4 className="popup__title">{t('photo_note')}</h4>
                            {msg?.error &&
                            <div className="text-danger error-service align-l mb-2">{msg?.error}</div>
                            }
                            {msg?.success &&
                            <div className="text-success align-l mb-2">{msg?.success}</div>
                            }
                            <div className="form-group">
                                {/*<label className="form-label" htmlFor="photo_note">{t('photo_note')}</label>*/}
                                <div className="form-value">
                                    <textarea type="text"
                                            id="photo_note"
                                            className="form-control"
                                            {...register('note')}
                                            placeholder={t('photo_note_placeholder')} rows="4">
                                    </textarea>
                                    <div className="text-danger">{errors.note?.message}</div>
                                </div>
                            </div>
                        </div>
                        <div className="popup__actions f jcc aic">
                            <button type="button" className="popup__btn-save btn btn-default btn--no-shadow btn--small" onClick={e => handleCancelEdit(e)}>{t('btn_cancel')}</button>
                            <button type="submit" className="popup__btn-download btn btn-gradient btn--no-shadow btn--small">{t('btn_request_edit')}</button>
                        </div>
                    </form>
                </div>
            </div>
            <div className={`popup__overlay ${isOpen ? 'active': ''}`}></div>
        </div>
    );
}

export default PopupRequestEdit;