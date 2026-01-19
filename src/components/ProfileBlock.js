import React, { useEffect } from "react";
import { useState } from "react";
import { UserIcon, UserInfo } from "./User";
import { LoadedImages } from "../application/ImageLoad";
import clientController, { COLORS } from "../application/ClientController";
import SettingsIcon from "../assets/icons/Settings.svg";
import DeskIcon from "../assets/icons/Desk.svg"
import FileIcon from "../assets/icons/File.svg";
import serverController from "../application/ServerController";
import { AccessLevels } from "../application/ServerController";
 

export const ProfileBlock = ({openModal = () => {}}) => {
    const [cardState, setCardState] = useState(0);
    const [chosenTheme, setTheme] = useState(clientController.theme);
    const [displayInfo, setInfo] = useState([`Level ${serverController.userData.accessLevel}`]);
    const [username, setUsername] = useState(serverController.userData.username);

    useEffect(() => {
        function updateTheme(){
            setTheme(clientController.theme);
        }
        function onGameStart(){
            const subject = serverController.userData.chosenTheme.title;
            const level = serverController.userData.accessLevel;
            const points = serverController.userData.currentGrade;
            console.log(subject);
            setInfo([`Level ${AccessLevels[level]}`, `Theme: ${subject}`, `${points} Points`]);
            setCardState(1);
        }
        function onGameFinish(){
            const level = serverController.userData.accessLevel;
            setInfo([`Level ${AccessLevels[level]}`]);
            setCardState(0);
        }

        function handleUserDataUpdate(){
            const data = serverController.userData;
            setUsername(data.username);
            setInfo([`Level ${AccessLevels[data.accessLevel]}`]);
        }

        clientController.subscribeOn('userdata-loaded', handleUserDataUpdate);
        clientController.subscribeOn('theme-switch', updateTheme);
        clientController.subscribeOn('game-start', onGameStart);
        clientController.subscribeOn('game-finish', onGameFinish);
        return () => {
            clientController.unSubscribeOn('userdata-loaded', handleUserDataUpdate);
            clientController.unSubscribeOn('theme-switch', updateTheme);
            clientController.unSubscribeOn('game-start', onGameStart);
            clientController.unSubscribeOn('game-finish', onGameFinish);
        }
    }, []);

    const smallButtons = [];
    switch(cardState){
        case 1: 
            smallButtons.push(<PaintButton onClick={openModal} theme={chosenTheme} key={'PainDesk'} />);
            break;
        case 0: 
            smallButtons.push(<SettingsButton onClick={openModal} theme={chosenTheme} key={'Settings'}/>);
            smallButtons.push(<FileButton onClick={openModal} theme={chosenTheme} key={'QuestionConstructor'}/>);
            break;
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
                    name: username,
                    other: displayInfo,
                }
            } theme={chosenTheme}/>
            <div style={{
                position: 'absolute',
                right: '0%',
                width: '4.5vh'
            }}>
                {smallButtons.map(val => (
                    val
                ))}
            </div>
        </div>
    );
}

const FileButton = ({onClick = () => {}, theme}) => {
    const [animState, setAnimState] = useState(0);

    let anim;
    switch(animState){
        case 1: anim = 'FileAnim'; break;
        default: anim = ''; break;
    }

    return(
        <div className={`SquareButton ${anim}`} style={{
            marginBottom: '3%',
            height: '6vh',

        }}
        onClick={() => {
            if(clientController.subjectTheme !== 0){
                onClick(4, () => {
                    // setAnimState(1);
                    // setTimeout(() => {setAnimState(0)}, 400);
                });
            }
            else{
                clientController.triggerEvent('show-tip', ['Choose theme first!', clientController.getColorSetting(2, 'yellow')]);
            }
            setAnimState(1);

            setTimeout(() => {setAnimState(0)}, 400);
        }}>
            <FileIcon stroke={clientController.getColorSetting(theme, COLORS.text)}style={{fill: clientController.getColorSetting(theme, COLORS.main),}}/>
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
            marginBottom: '3%',
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

const PaintButton = ({onClick = () => {}, theme}) => {
    const [animState, setAnimState] = useState(0);

    let anim;
    switch(animState){
        case 1: anim = 'FileAnim'; break;
        default: anim = ''; break;
    }

    return(
        <div className={`SquareButton ${anim}`} style={{
            marginBottom: '3%',
            height: '5vh',
        }}
        onClick={() => {
            const tipText = clientController.store['currentQuestion'];
            onClick(5, () => {
                setAnimState(2);
            }, tipText == undefined? '': tipText);
            setAnimState(1);
        }}>
            <DeskIcon style={{fill: clientController.getColorSetting(theme, COLORS.text)}} width={30} height={50}/>
        </div>
    )
}