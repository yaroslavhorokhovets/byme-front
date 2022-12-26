import 'rc-calendar/assets/index.css';
import React, {Component, useState} from 'react';
import Calendar from 'rc-calendar';
import DatePicker from 'rc-calendar/lib/Picker';
import moment from 'moment';
import IconSvg from "components/icon/";

import jaJP from 'rc-calendar/lib/locale/ja_JP';
import 'moment/locale/ja';

const InputDateTime = props => {
    const { t, lan, date, handleChange }  = props;
    
    // const handleChange = (date) => {
    //     const selectedDate = moment(date).format('DD/MM/YYYY');
    //     console.log(`handleChange calendar: `, selectedDate);
    //     setDate(date);
    //     setSelectedDate(date);
    // }
    const calendar = (<Calendar locale={jaJP}/>);
        
    return (
        <div className="input-datetime">
            <div className="input-datetime__inner">
                <DatePicker
                    animation="slide-up"
                    value={moment(date)}
                    disabled={false}
                    calendar={calendar}
                    onChange={handleChange.bind(this)}
                >{
                    ({value}) => {
                        return (
                            <input 
                                className='input-datetime__el' 
                                value={moment(value).format('YYYY/MM/DD')}
                                readOnly
                            />
                        )
                    }
                }</DatePicker>
                <IconSvg icon='calendar' />
            </div>
        </div>
    )
}

export default InputDateTime;