import React, {useEffect} from "react";
import IconSvg from "components/icon/";

const PopupInvoiceUpload = props => {
    const { t, isOpen, isSuccessUpload, isErrorUpload, handleClosePopup, handleSaveFile, handleSubmit } = props;

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
        <div className={`popup__list popup__list--upload ${isOpen ? 'active': ''}`}>
            <div className={`popup__item relative ${isOpen ? 'active': ''}`}>
                <div className="popup__item-inner">
                    <div className="popup__close f jce aic" onClick={e => handleClosePopup(e)}>
                        <IconSvg icon='close' />
                    </div>
                    <div className="popup__content">
                        <h4 className="popup__title align-c">アップロード</h4>
                        <p className="popup__content align-c">アップロードファイルByme サイズ30MB </p>
                        <div className="popup_upload-file relative">
                            <div className="form-group file-area">
                                <IconSvg icon="upload" />
                                <label htmlFor="images">{t('upload_document_label')}</label>
                                <input 
                                    type="file" 
                                    name="document" 
                                    id="upload-document" 
                                    required="required"
                                    accept=".xlsx"
                                    onChange={handleSaveFile}
                                />
                                <div className="file-dummy">
                                    {isSuccessUpload && 
                                        <div className="text-success">{t('msg_upload_video_success')}</div>
                                    }
                                    {isErrorUpload && 
                                        <div className="text-danger">{t('msg_upload_video_errors')}</div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="popup__actions f jcc aic">
                        <button type="button" className="popup__btn-cancel btn btn-default btn--no-shadow btn--small" onClick={e => handleClosePopup(e)}>{t('btn_cancel')}</button>
                        <button type="button" className="popup__btn-upload btn btn-gradient btn--no-shadow btn--small" onClick={e => handleSubmit(e)}>{t('btn_invoice_save')}</button>
                    </div>
                </div>
            </div>
            <div className={`popup__overlay ${isOpen ? 'active': ''}`}></div>
        </div>
    );
}

export default PopupInvoiceUpload;