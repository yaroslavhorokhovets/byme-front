import React, {useEffect} from "react";
import IconSvg from "components/icon/";

const PopupDownload = props => {
    const { isCategory, t, data, isOpen, radioChange, handleClosePopup, handleSaveFiles, handleDownloadFiles } = props;

    useEffect(() => {
        const close = (e) => {
            if (e.keyCode === 27) {
                handleClosePopup(e);
            }
        }
        window.addEventListener('keydown', close)
        return () => window.removeEventListener('keydown', close)
    });
    
    return isOpen && (
        <div className={`popup__list popup__list--download ${isOpen ? 'active': ''}`}>
            <div className={`popup__item relative ${isOpen ? 'active': ''}`}>
                <div className="popup__item-inner">
                    <div className="popup__close f jce aic" onClick={e => handleClosePopup(e)}>
                        <IconSvg icon='close' />
                    </div>
                    <div className="popup__content">
                        <h4 className="popup__title">{t('popup_download_title')}</h4>
                        <div className="form-group__radio">
                            <input onClick={e => radioChange(e)} type="radio" id={`${isCategory}_option_169`} name="radio-group" value="16x9" defaultChecked/>
                            <label htmlFor={`${isCategory}_option_169`}>{t('popup_download_option_169')}</label>
                        </div>
                        <div className="form-group__radio">
                            <input onClick={e => radioChange(e)} type="radio" id={`${isCategory}_option_43`} name="radio-group" value="4x3" />
                            <label htmlFor={`${isCategory}_option_43`}>{t('popup_download_option_43')}</label>
                        </div>
                        <div className="form-group__radio">
                            <input onClick={e => radioChange(e)} type="radio" id={`${isCategory}_option_11`} name="radio-group" value="1x1"/>
                            <label htmlFor={`${isCategory}_option_11`}>{t('popup_download_option_11')}</label>
                        </div>
                    </div>
                    <div className="popup__actions f jcc aic">
                        <button type="button" className="popup__btn-save btn btn-default btn--no-shadow btn--small" onClick={e=> handleSaveFiles(e)}>{t('btn_save')}</button>
                        <button type="button" className="popup__btn-download btn btn-gradient btn--no-shadow btn--small" onClick={e=> handleDownloadFiles(e)}>{t('btn_download')}</button>
                    </div>
                </div>
            </div>
            <div className={`popup__overlay ${isOpen ? 'active': ''}`}></div>
        </div>
    );
}

export default PopupDownload;