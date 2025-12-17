import React, { useEffect } from "react";
import clientController, { COLORS } from "../application/ClientController";
                                                                                //'functionalActive'
export const Tip = ({tip = '', color = clientController.getColorSettingDefault('mainText'),  onClose = () => {}}) => {

    useEffect(
        () => {
            setTimeout(onClose, 4000)
        }, []
    );

    return(
        <div className="Tip DefaultFont " style={{
            backgroundColor: clientController.getColorSettingDefault('functionalActive'),
            color: clientController.getColorSettingDefault('mainText'),
            "--tip-statusbar-color": color, //'mainText' 
        }}>{tip}</div>
    );
}