import React, {useEffect} from "react";
import IconSvg from "components/icon/";

const PopupPhotos = props => {
    const { t, url, image_id, isOpen, handleClosePopup, handleDownload, handleRequestEdit, handleUploadGoogle } = props;

    useEffect(() => {
        const close = (e) => {
            if (e.keyCode === 27) {
                handleClosePopup();
            }
        }
        window.addEventListener('keydown', close)
        return () => window.removeEventListener('keydown', close)
    });
    
    return (
        <div className={`popup__list popup__list--photos ${isOpen ? 'active': ''}`}>
            <div className={`popup__item relative ${isOpen ? 'active': ''}`}>
                <div className="popup__item-inner">
                    <div className="popup__close f jce aic" onClick={e => handleClosePopup()}>
                        <IconSvg icon='close' />
                    </div>
                    <div className="popup__item-img relative image--cover ratio">
                        <img className="image__img" src={url} alt={image_id} />
                    </div>
                    <div className="popup__actions f jcc aic">
                        <div className="popup__download" onClick={e => handleDownload()}>{t('btn_download')}</div>
                        <div className="popup__request-edit" onClick={e => handleRequestEdit()}>{t('btn_request_edit')}</div>
                        <div className="popup__upload__google" onClick={e => handleUploadGoogle(url, image_id)}>{t('btn_upload_google')}</div>
                    </div>
                </div>
            </div>
            <div className={`popup__overlay ${isOpen ? 'active': ''}`}></div>
        </div>
    );
}

export default PopupPhotos;