import React, { useEffect, useState } from "react";
import { DefaultButton } from "./DefaultButton";
import "../assets/styles/GameBlock.css"
import { LoadedImages } from "../application/ImageLoad";
import clientController, { COLORS } from "../application/ClientController";

export const GameBlock = ({GameInfo = {type: 'undefined', description: 'undefined', 
    typeDescripe: 'undefined', iconUrl: 'undefined', typeId: 0}, setActive = (type) => {}
}) => {
    const [chosenTheme, setTheme] = useState(clientController.theme);
    const [isChosen, Choose] = useState(false);
    
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
        <div className="GameBlock" 
        style={{
            backgroundColor: clientController.getColorSetting(chosenTheme, COLORS.main),
            border: isChosen
            ? 'solid 2px ' + clientController.getColorSetting(chosenTheme, COLORS.button)
            : 'solid 2px ' + clientController.getColorSetting(chosenTheme, COLORS.main),
        }}
        onClick={() => {
            Choose(setActive({type: GameInfo.typeId, onNew: () => Choose(false)}));
        }}
        >
            <div className="DefaultFont" style={{
                color: clientController.getColorSetting(chosenTheme, COLORS.text), 
                fontSize: '22px', marginBottom: '3%', marginLeft: '3%',
                marginTop: '5%', fontWeight: 600
                }}>
                {GameInfo.type}
            </div>
            <div className="InfoInGameBlock">
                <div className="DefaultFont" style={{
                    color: clientController.getColorSetting(chosenTheme, COLORS.text2),
                    marginLeft: '3%', fontWeight: 600,
                }}> 
                    <div className="DefaultFont" style={{
                        fontSize: '14px',
                        color: clientController.getColorSetting(chosenTheme, COLORS.button),
                        }}>
                        {GameInfo.type}
                    </div>
                    <div className="DefaultFont" style={{
                        color: clientController.getColorSetting(chosenTheme, COLORS.text), 
                        fontSize: '16px', lineHeight: '30px',
                        }}>
                        {GameInfo.typeDescripe}
                    </div>
                    <div className="DefaultFont" style={{
                        fontSize: '14px',
                        }}>
                        {GameInfo.description}
                    </div>
                    {/* <DefaultButton text="Play" styles={{left: '3%', bottom: '0%', 
                    color: clientController.getColorSetting(chosenTheme, COLORS.text),
                    backgroundColor: clientController.getColorSetting(chosenTheme, COLORS.functional),}} 
                    onClick={() => {moveToGame(GameInfo.typeId)}}
                    /> */}
                </div>
                <InGameIcon iconUrl={GameInfo.iconUrl} theme={chosenTheme}/>
            </div>
        </div>
    )
}

const InGameIcon = ({iconUrl, theme}) => (
    <div className="InGameIcon" style={{backgroundImage: `url(${iconUrl})`, backgroundColor: clientController.getColorSetting(theme, COLORS.functional)}}></div>
);