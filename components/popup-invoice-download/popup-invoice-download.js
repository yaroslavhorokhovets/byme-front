import React, {useEffect} from "react";
import IconSvg from "components/icon/";

const PopupInvoiceDownload = props => {
    const { t, data, isOpen, handleClosePopup, handleSaveFile } = props;

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
        <div className={`popup__list popup__list--document-download ${isOpen ? 'active': ''}`}>
            <div className={`popup__item relative ${isOpen ? 'active': ''}`}>
                <div className="popup__item-inner">
                    <div className="popup__close f jce aic" onClick={e => handleClosePopup(e)}>
                        <IconSvg icon='close' />
                    </div>
                    <div className="popup__content">
                        <h4 className="popup__title align-c">ファイルをダウンロードする</h4>
                        <p className="popup__content align-c">ダウンロードファイルByme <span className='bold'>{data?.filename}</span> サイズ30MB </p>
                    </div>
                    <div className="popup__actions f jcc aic">
                        <button type="button" className="popup__btn-save btn btn-default btn--no-shadow btn--small" onClick={e => handleClosePopup(e)}>{t('btn_cancel')}</button>
                        <a type="button" 
                           target="_blank"
                           href={data}
                           className="popup__btn-download btn btn-gradient btn--no-shadow btn--small" 
                           onClick={e => handleSaveFile()}
                           download>{t('btn_download')}</a>
                    </div>
                </div>
            </div>
            <div className={`popup__overlay ${isOpen ? 'active': ''}`}></div>
        </div>
    );
}

export default PopupInvoiceDownload;