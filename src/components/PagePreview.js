import React, { useEffect } from "react";
import { useState } from "react";
import clientController, { COLORS } from "../application/ClientController";

export const PagePreview = ({text = "text"}) => {
    const [isBackButton, setBackButton] = useState(false);
    const [chosenTheme, setTheme] = useState(clientController.theme);
    const [screen, setScreen] = useState(clientController.identifyScreenType());

    useEffect(() => {
        function updateTheme(){
            setTheme(clientController.theme);
        }
        function handleScreenUpdate(type){
            setScreen(type);
        }

        clientController.subscribeOn('theme-switch', updateTheme);
        clientController.subscribeOn('resize', handleScreenUpdate);

        return () => {
            clientController.unSubscribeOn('theme-switch', updateTheme);
            clientController.unSubscribeOn('resize', handleScreenUpdate);
        }
    }, []);

    return(
        <div className="PagePreview DefaultFont" style={{
            color: clientController.getColorSetting(chosenTheme, COLORS.text),
            borderBottom: screen == 'Desktop'?  `2px solid ${clientController.getColorSetting(chosenTheme, COLORS.borderD)}`: ''
        }}>{text}</div>
    );
}