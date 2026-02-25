import React, { useState } from "react";
import clientController, { COLORS } from "../application/ClientController";

export const DefaultButton = ({children, text = 'default', styles = {}, onClick = () => {}, type}) => {
    const [shadowState, setShadow] = useState(true);

    let shadow;
    if(shadowState){
        shadow = 'DefaultButtonShadow'
    }

    return(
        <button className={`DefaultButton ${shadow} DefaultFont`} type={type} style={{
            backgroundColor: clientController.getColorSettingDefault(COLORS.button),
            color: clientController.getColorSettingDefault(COLORS.text),
            ...styles}}
            onPointerDown={() => setShadow(false)}
            onPointerUp={() => setShadow(true)}
            onPointerLeave={() => setShadow(true)}
            onClick={onClick}
        >
            {children}
            {text}
        </button>
    );
}