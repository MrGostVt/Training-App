import React, { useState } from "react";
import clientController, { COLORS } from "../application/ClientController";

export const Switch = ({title, values = [{val, prev, descrip, buttonStyles: {}}], settings = {reverse: false, title: true}, current = 0, callback = (val) => {}}) => {
    const [pointer, setPoint] = useState(current);
    const text = values[pointer].prev;

    function switchPointer(){
        let point = pointer + 1 === values.length? 0: pointer + 1;
        setPoint(point);
        return point;
    }

    return(
        <div className="SwitchBlock DefaultFont" onClick={() => {
            // setTheme(!!chosenTheme? 0: 1);
            // clientController.switchTheme();
            let point = switchPointer();
            callback(values[point].val);
        }} style={{
            fontSize: '20px', color: clientController.getColorSettingDefault(COLORS.text),
            flexDirection: settings.reverse? 'row-reverse': 'row'
        }}>
            {settings.title? title: null}
            <div style={{marginLeft: settings.reverse? '2%': 'none', width: 'auto', overflow: 'hidden', textAlign: 'left'}}>{values[pointer].descrip}</div>
            <div className="SwitchButton" 
            style={{backgroundColor: clientController.getColorSettingDefault(COLORS.functionalA),
                marginRight: settings.reverse? 'auto': 'none',
                marginLeft: settings.reverse? 'none': 'auto', 
                ...values[pointer].buttonStyles
            }}>
                {text}
            </div>
        </div>
    )
};
