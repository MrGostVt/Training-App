import React, { useEffect } from "react";
import { useState } from "react";
import clientController, { COLORS } from "../application/ClientController";

export const PagePreview = ({text = "text"}) => {
    const [isBackButton, setBackButton] = useState(false);
    const [chosenTheme, setTheme] = useState(clientController.theme);

    useEffect(() => {
        function updateTheme(){
            setTheme(clientController.theme);
        }
        clientController.subscribeOn('theme-switch', updateTheme);

        return () => {
            clientController.unSubscribeOn('theme-switch', updateTheme);
        }
    }, []);

    return(
        <div className="PagePreview DefaultFont" style={{
            color: clientController.getColorSetting(chosenTheme, COLORS.text),
        }}>{text}</div>
    );
}