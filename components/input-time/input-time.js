import React, {Component} from 'react';
import TimePicker from 'rc-time-picker';
import moment from 'moment';
import IconSvg from "components/icon/";

import 'rc-time-picker/assets/index.css';

const InputTime = props => {
    const { t, lan, value, handleValueChange }  = props;
    return (
        <div className="input-time">
            <div className="input-time__inner">
                <TimePicker 
                    defaultValue={value} 
                    onChange={handleValueChange} />
                <IconSvg icon='clock' />
            </div>
        </div>
    );
}
export default InputTime;