import React, { useEffect } from "react";
import { useState } from "react";
import { UserIcon, UserInfo } from "./User";
import { LoadedImages } from "../application/ImageLoad";
import clientController, { COLORS } from "../application/ClientController";
import SettingsIcon from "../assets/icons/Settings.svg"
import serverController from "../application/ServerController";
 

export const ProfileBlock = ({userName, openModal = () => {}}) => {
    const [cardState, setCardState] = useState(0);
    const [chosenTheme, setTheme] = useState(clientController.theme);
    const [displayInfo, setInfo] = useState([`Level ${1}`]);

    useEffect(() => {
        function updateTheme(){
            setTheme(clientController.theme);
        }
        function onGameStart(){
            const subject = serverController.subjectThemes[clientController.subjectTheme-1];
            setInfo([`Level ${1}`, `Theme: ${subject.themeName}`, `${subject.points} Points`]);
            setCardState(1);
        }
        function onGameFinish(){
            setInfo([`Level ${1}`]);
            setCardState(0);
        }

        clientController.subscribeOn('theme-switch', updateTheme);
        clientController.subscribeOn('game-start', onGameStart);
        clientController.subscribeOn('game-finish', onGameFinish);
        return () => {
            clientController.unSubscribeOn('theme-switch', updateTheme);
            clientController.unSubscribeOn('game-start', onGameStart);
            clientController.unSubscribeOn('game-finish', onGameFinish);
        }
    }, []);

    const smallButtons = [];
    switch(cardState){
        case 0: smallButtons.push(<SettingsButton onClick={openModal} theme={chosenTheme} key={'Settings'}/>); break;
    }

    return(
        <div style={
            {
                left: '5%', 
                width: '90%', 
                position: 'relative', 
                height: '17vh',
                display: '-webkit-inline-box',
                marginBottom: '5%',
            }}>
            <UserIcon />
            <UserInfo info={
                {
                    name: userName,
                    other: displayInfo,
                }
            } theme={chosenTheme}/>

            {smallButtons.map(val => (
                val
            ))}
        </div>
    );
}

const SettingsButton = ({onClick = () => {}, theme}) => {
    const [animState, setAnimState] = useState(0);

    let anim;
    switch(animState){
        case 2: anim = 'SettingsClose'; break;
        case 1: anim = 'SettingsOpen'; break;
        default: anim = ''; break;
    }

    return(
        <div className={`SquareButton ${anim}`} style={{
            right: '0%'
        }}
        onClick={() => {
            onClick(1, () => {
                setAnimState(2);
            });
            setAnimState(1);
        }}>
            <SettingsIcon style={{fill: clientController.getColorSetting(theme, COLORS.text)}}/>
        </div>
    );
}