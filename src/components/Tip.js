import React, { useEffect } from "react";
import clientController, { COLORS } from "../application/ClientController";
export const Tip = ({tip = '', color = clientController.getColorSettingDefault('mainText'),  onClose = () => {}}) => {

    useEffect(
        () => {
            setTimeout(onClose, 4000);
        }, []
    );

    return(
        <div className="Tip DefaultFont " style={{
            backgroundColor: clientController.getColorSettingDefault(COLORS.main),
            color: clientController.getColorSettingDefault('mainText'),
            "--tip-statusbar-color": color,
            fontSize: 'bolder',
        }}>{tip}</div>
    );
}