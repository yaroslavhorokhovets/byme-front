import React, { useState } from "react";
import IconSvg from "../icon";

const VideoItems = (props) => {
    const { t, isUpload, handleUpload, isSuccessUpload, isErrorUpload, title, items } = props;
    return (
        <div className="video-guide">
            <div className="video-guide__inner">
                {title && 
                    <div className="video-guide__title bold d-none">{title}</div>
                }
                <div className="video-guide__items f fw jcs ait">
                    {items.map((item, index) => (
                        <div className="video-guide__item" key={index} data-title={item.title}>
                            <div className="video-guide__item-inner">
                                <a className="video-guide__item-link relative f fdc jcc aic" href={item.url} target="_blank">
                                    {/*<div className="video-guide__item-img image--contain ratio">*/}
                                        {/*<img className="image__img" src={item.src} alt="card"/>*/}
                                    {/*</div>*/}
                                    
                                    <IconSvg icon='video' />
                                    <div className="video-guide__item-name align-c">{item.filename}</div>
                                </a>
                            </div>
                        </div>
                    ))}

                    {isUpload ?
                        <div className="video-guide__item video-guide__item--upload">
                            <div className="video-guide__item-inner relative">
                                <div className="form-group file-area">
                                    <IconSvg icon="upload" />
                                    <label className="medium c-neutrals-4" htmlFor="video">{t('upload_video_label')}</label>
                                    <input 
                                        type="file" 
                                        name="video" 
                                        id="upload-video" 
                                        required="required"
                                        accept="video/*"
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

export default VideoItems;