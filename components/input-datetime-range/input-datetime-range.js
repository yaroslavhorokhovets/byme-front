import 'rc-calendar/assets/index.css';
import React, { Component, useState, useEffect } from 'react';
import Calendar from 'rc-calendar';
import DatePicker from 'rc-calendar/lib/Picker';
import 'rc-time-picker/assets/index.css';
import TimePickerPanel from 'rc-time-picker/lib/Panel';
import moment from 'moment';
import IconSvg from "components/icon/";

import jaJP from 'rc-calendar/lib/locale/ja_JP';
import 'moment/locale/ja';

const format = 'YYYY/MM/DD HH:mm:ss';
const cn = null; // location.search.indexOf('cn') !== -1;
const SHOW_TIME = true;
const getFormat = (time) => (time ? format : 'YYYY/MM/DD');

const now = moment();
now.locale('ja').utcOffset(8);
const timePickerElement = <TimePickerPanel />;


const Picker = props => {
    const { showTime, disabled, disabledDate, value, onChange, placeholder } = props;

    return (
        <DatePicker
            animation="slide-up"
            disabled={disabled}
            calendar={
                <Calendar
                    locale={jaJP}
                    defaultValue={now}
                    timePicker={showTime ? timePickerElement : null}
                    disabledDate={disabledDate}
                />
            }
            value={value}
            onChange={onChange}
        >
            {
                ({ value }) => {
                    return (
                        <div className='input-datetime'>
                            <input
                                className='form-control'
                                readOnly
                                placeholder={placeholder}
                                disabled={disabled}
                                value={value && value.format(getFormat(showTime)) || ''}
                            />
                        </div>
                    );
                }
            }
        </DatePicker>
    );
}

const InputDateTimeRange = props => {
    const { isValid, t, lan, labelStart, labelEnd, onChange, startDate, endDate } = props;

    // const [startDate, setStartDate] = useState(null);
    // const [endDate, setEndDate] = useState(null);

    // const onChange = (field, value) => {
    //     // console.log('onChange', field, value && value.format(getFormat(SHOW_TIME)));
    //     if (field == 'startValue') {
    //         setStartDate(value);
    //     } else {
    //         setEndDate(value);
    //     }
    // }

    const fnDisabledEndDate = (endValue) => {
        if (!endValue) {
            return false;
        }
        const startValue = startDate;
        if (!startValue) {
            return false;
        }
        return SHOW_TIME ? endValue.isBefore(startValue) :
            endValue.diff(startValue, 'days') <= 0;
    }

    const fnDisabledStartDate = (startValue) => {
        if (!startValue) {
            return false;
        }
        const endValue = endDate;
        if (!endValue) {
            return false;
        }
        return SHOW_TIME ? endValue.isBefore(startValue) :
            endValue.diff(startValue, 'days') <= 0;
    }

    useEffect(() => {
    });

    return (
        <div className={`input-datetime-range ${isValid ? 'is-error' : ''}`}>
            <div className="input-datetime-range__start">
                <label htmlFor="">{labelStart}</label>
                <div className="input-datetime-range__start-inner">
                    <Picker
                        placeholder={`yyyy/mm/dd`}
                        disabledDate={fnDisabledEndDate}
                        value={startDate}
                        onChange={onChange.bind(this, 'startValue')}
                    />
                    <IconSvg icon='calendar' />
                </div>
            </div>

            <div className="input-datetime-range__end">
                <label htmlFor="">{labelEnd}</label>
                <div className="input-datetime-range__end-inner">
                    <Picker
                        placeholder={`yyyy/mm/dd`}
                        disabledDate={fnDisabledStartDate}
                        value={endDate}
                        onChange={onChange.bind(this, 'endValue')}
                    />
                    <IconSvg icon='calendar' />
                </div>
            </div>
        </div>
    );
}

export default InputDateTimeRange;