import React, { useEffect, useState } from "react";
import { DefaultButton } from "./DefaultButton";
import "../assets/styles/GameBlock.css"
import { LoadedImages } from "../application/ImageLoad";
import clientController, { COLORS } from "../application/ClientController";

export const GameBlock = ({GameInfo = {type: 'undefined', description: 'undefined', 
typeDescripe: 'undefined', iconUrl: 'undefined', typeId: 0}, 
moveToGame = () => {}}) => {
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
        <div className="GameBlock">
            <div className="DefaultFont" style={{color: clientController.getColorSetting(chosenTheme, COLORS.text), fontSize: '22px', marginBottom: '3%'}}>
                {GameInfo.type}
            </div>
            <div className="InfoInGameBlock">
                <div className="DefaultFont" style={{color: clientController.getColorSetting(chosenTheme, COLORS.text2), fontSize: '14px', width: '60%'}}>
                    {GameInfo.type}
                </div>
                <div className="DefaultFont" style={{color: clientController.getColorSetting(chosenTheme, COLORS.text), fontSize: '16px', width: '60%', lineHeight: '30px'}}>
                    {GameInfo.typeDescripe}
                </div>
                <div className="DefaultFont" style={{color: clientController.getColorSetting(chosenTheme, COLORS.text2), fontSize: '14px', width: '60%'}}>
                    {GameInfo.description}
                </div>
                <DefaultButton text="Play" styles={{left: '0%', bottom: '0%', 
                color: clientController.getColorSetting(chosenTheme, COLORS.text),
                backgroundColor: clientController.getColorSetting(chosenTheme, COLORS.functional),}} 
                onClick={() => {moveToGame(GameInfo.typeId)}}
                />
                <InGameIcon iconUrl={GameInfo.iconUrl} theme={chosenTheme}/>
            </div>
        </div>
    )
}

const InGameIcon = ({iconUrl, theme}) => (
    <div className="InGameIcon" style={{backgroundImage: `url(${iconUrl})`, backgroundColor: clientController.getColorSetting(theme, COLORS.functional)}}></div>
);