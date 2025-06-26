import React, { useState } from "react";
import clientController, { COLORS } from "../application/ClientController";

export const Switch = ({title, values = [{val, prev, descrip}], current = 0, callback = () => {}}) => {
    const [pointer, setPoint] = useState(current);
    const text = values[pointer].prev;

    function switchPointer(){
        let point = pointer + 1 === values.length? 0: pointer + 1;
        setPoint(point);
        return point;
    }

    return(
        <div className="ThemeSwitch DefaultFont" onClick={() => {
            // setTheme(!!chosenTheme? 0: 1);
            // clientController.switchTheme();
            let point = switchPointer();
            callback(values[point].val);
        }} style={{fontSize: '20px', color: clientController.getColorSettingDefault(COLORS.text)}}>
            {title}
            <div style={{marginLeft: '2%', width: '60%', overflow: 'hidden'}}>{values[pointer].descrip}</div>
            <div className="ThemeButton" 
            style={{backgroundColor: clientController.getColorSettingDefault(COLORS.functionalA)}}>
                {text}
            </div>
        </div>
    )
};
