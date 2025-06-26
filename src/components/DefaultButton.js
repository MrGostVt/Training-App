import React, { useState } from "react";
import clientController, { COLORS } from "../application/ClientController";

export const DefaultButton = ({text = 'default', styles = {}, onClick = () => {}}) => {
    const [shadowState, setShadow] = useState(true);

    let shadow;
    if(shadowState){
        shadow = 'DefaultButtonShadow'
    }

    return(
        <div className={`DefaultButton ${shadow} DefaultFont`} style={{
            backgroundColor: clientController.getColorSettingDefault(COLORS.button),
            color: clientController.getColorSettingDefault(COLORS.text),
            ...styles}}
        onMouseDown={() => {
            setShadow(false)
        }}
        onMouseLeave={() => {
            if(!shadow){
                setShadow(true);
            }
        }}
        onMouseUpCapture={() => {
            if(!shadow){
                console.log('mause up')
                onClick();
                setShadow(true);
            }
        }}
        onTouchStart={() => {
            setShadow(false);
        }}
        onTouchEndCapture={(ev) => {
            ev.preventDefault();
            if(!shadow){
                console.log('yeah')
                onClick();
                setShadow(true);
            }
        }}
        
        onTouchCancel={() => {
            console.log("cancel")
        }}
        onTouchCancelCapture={() => {
            console.log("cancelCapture")
        }}
        >
            {text}
        </div>
    );
}