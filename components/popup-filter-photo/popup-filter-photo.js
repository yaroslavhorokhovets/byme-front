import React, {useEffect, useState} from "react";
import InputDateTimeRange from "components/input-datetime-range/input-datetime-range";
import { AccountService } from "services";

const PopupFilterPhoto = props => {
    const { t, listUsers, startDate, endDate, isValidRangeDate, isOpen, handleChecked, handleClosePopup, handleSavePopup, onChangeRangeDate } = props;

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
        <div className={`popup-filter-photo ${isOpen ? 'active': ''}`}>
            <div className="inner">
                
                <div className="form-group">
                    <div className="form-date-value f jcs aic">
                        <InputDateTimeRange
                            isValid={isValidRangeDate}
                            labelStart={t('input_start_date_label')}
                            labelEnd={t('input_end_date_label')}
                            onChange={onChangeRangeDate}
                            startDate={startDate}
                            endDate={endDate}
                        />
                    </div>
                </div>

                <div className="list">
                    {listUsers?.map((item, index) => (
                        <div key={index} className="item">
                            <div className="form-group__checkbox form-group__checkbox--photos">
                                <input type="checkbox"
                                    onChange={e => handleChecked(e)}
                                    id={item._id}
                                    name={`facility_name_${item._id}`}
                                    value={item._id}
                                />
                                <label htmlFor={item._id}>{item.facility_name ? item.facility_name : item.email}</label>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="actions">
                    <button type="button" className="btn btn-gradient btn--no-shadow btn--small" onClick={e => handleSavePopup(e)}>{t('btn_filter_save')}</button>
                    <button type="button" className="btn btn-default btn--no-shadow btn--small" onClick={e => handleClosePopup(e)}>{t('btn_cancel')}</button>
                </div>
            </div>
        </div>
    );
}

export default PopupFilterPhoto;