import React, { useState } from "react";
import IconSvg from "../icon";
import { tutorialService } from '../../services'

const DocumentItems = (props) => {
    const { t, isUpload, handleUpload, isSuccessUpload, isErrorUpload, handleConfirmDownload, title, items } = props;

    return (
        <div className="document">
            <div className="document__inner">
                <div className="document__title bold">{title}</div>
                <div className="document__items f fw jcs ait">
                    {items.map((item, index) => (
                        <div className="document__item" key={index} data-folder={item.folder}>
                            <div className="document__item-inner  relative f fdc jcc aic">
                                <div className="document__item-download" onClick={e => handleConfirmDownload(item)}>
                                    <IconSvg icon="download" />
                                </div>

                                {/*<div className="document__item-img image--contain ratio">*/}
                                    {/*<img className="image__img" src={item.src} alt="card"/>*/}
                                {/*</div>*/}
                                
                                <IconSvg icon='document' />
                                <div className="document__item-name align-c">{item.filename}</div>
                            </div>
                        </div>
                    ))}
                    
                    {isUpload ?
                        <div className="document__item document__item--upload">
                            <div className="document__item-inner relative">
                                <div className="form-group file-area">
                                    <IconSvg icon="upload" />
                                    <label className="medium c-neutrals-4" htmlFor="images">{t('upload_document_label')}</label>
                                    <input 
                                        type="file" 
                                        name="document" 
                                        id="upload-document" 
                                        required="required"
                                        accept=".doc,.docx,.pdf"
                                        onChange={handleUpload}
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
                        : null
                    }
                </div>

                {items.length < 1 &&
                    <p className='text-danger align-c'>{t('record_not_found')}</p>
                }
            </div>
        </div>
    );
}

export default DocumentItems;
