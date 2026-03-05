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
import { DefaultButton } from "./DefaultButton";
 

export const ProfileBlock = ({openModal = () => {}}) => {
    const [cardState, setCardState] = useState(0);
    const [chosenTheme, setTheme] = useState(clientController.theme);
    const [displayInfo, setInfo] = useState(
        [
            {text: `Level: ${AccessLevels[serverController.userData.accessLevel]}`, styles: {
            color: clientController.getColorSettingDefault(COLORS.button),
            fontWeight: 600,}
            }
        ]
    );
    const [username, setUsername] = useState(serverController.userData.username);
    const [screen, setScreen] = useState(clientController.identifyScreenType());

    useEffect(() => {
        function updateTheme(){
            setTheme(clientController.theme);
            handleUserDataUpdate();
        }
        function onGameStart(){
            const subject = serverController.userData.chosenTheme.title;
            const level = serverController.userData.accessLevel;
            const points = serverController.userData.currentGrade;

            // setInfo([
            //     {text: `Level: ${AccessLevels[level]}`, styles: {
            //         color: clientController.getColorSettingDefault(COLORS.button),
            //         fontWeight: 600,
            //     }}, 
            //     {text: `Theme: ${subject}`, styles: {
            //         color: clientController.getColorSettingDefault(COLORS.text3),
            //         fontWeight: 600,
            //     }}, 
            //     {text: `${points} Points`, styles: {
            //         color: clientController.getColorSettingDefault(COLORS.text),
            //         fontSize: '22px', fontWeight: 600
            //     }}
            // ]);
            setCardState(1);
        }
        function onGameFinish(){
            const level = serverController.userData.accessLevel;
            // setInfo([{text: `Level: ${AccessLevels[level]}`, styles: {
            //     color: clientController.getColorSettingDefault(COLORS.button),
            //     fontWeight: 600,
            // }}]);
            setCardState(0);
        }

        function handleUserDataUpdate(){
            const data = serverController.userData;
            setUsername(data.username);
            console.log('OTHER DATA!');
            console.log(data)
            setInfo([{text: `Level: ${AccessLevels[data.accessLevel]}`, styles: {
                color: clientController.getColorSettingDefault(COLORS.button),
                fontWeight: 600,
            }}]);
        }

        function handleScreenUpdate(type){
            setScreen(type);
        }

        clientController.subscribeOn('userdata-loaded', handleUserDataUpdate);
        clientController.subscribeOn('theme-switch', updateTheme);
        clientController.subscribeOn('game-start', onGameStart);
        clientController.subscribeOn('game-finish', onGameFinish);
        clientController.subscribeOn('resize', handleScreenUpdate);
        return () => {
            clientController.unSubscribeOn('userdata-loaded', handleUserDataUpdate);
            clientController.unSubscribeOn('theme-switch', updateTheme);
            clientController.unSubscribeOn('game-start', onGameStart);
            clientController.unSubscribeOn('game-finish', onGameFinish);
            clientController.unSubscribeOn('resize', handleScreenUpdate);
        }
    }, []);

    const smallButtons = [];
    switch(cardState){
        case 1: 
            smallButtons.push(
                <Button text="Paint desk" theme={chosenTheme} onClick={(onExit) => {
                    const tipText = clientController.store['currentQuestion'];
                    openModal(5, onExit, tipText == undefined? '': tipText);
                }} key={'PaintDesk'} getAnimation={(state) => {
                    return '';
                }}>
                    <DeskIcon style={{fill: clientController.getColorSetting(chosenTheme, COLORS.text)}} width={30} height={50}/>
                </Button>
            );
            break;
        case 0: 
            smallButtons.push(
                <Button text="Settings" theme={chosenTheme} onClick={(onExit) => {
                    openModal(1, onExit);
                }} key={'SettingsButton'} getAnimation={(animState) => {
                    switch(animState){
                        case 2: return 'SettingsClose';
                        case 1: return 'SettingsOpen';
                        default: return '';
                    }
                }}>
                    <SettingsIcon 
                    width={30} height={30}
                    style={{fill: clientController.getColorSetting(chosenTheme, COLORS.text)}}/>
                </Button>
            );
            smallButtons.push(
                <Button text="Question constructor" theme={chosenTheme} onClick={(onExit) => {
                    if(clientController.subjectTheme !== 0) openModal(4, onExit);
                    else clientController.triggerEvent('show-tip', ['Choose theme first!', clientController.getColorSetting(2, 'yellow')]);
                }} key={'QuestionConstructorButton'} getAnimation={(state) => {
                    return '';
                }}>
                    <FileIcon height={30} width={30}
                    viewBox="2 2 20 20"
                    stroke={clientController.getColorSetting(chosenTheme, COLORS.text)}
                    style={{
                        fill: clientController.getColorSetting(chosenTheme, COLORS.main),
                    }}/>
                </Button>
            );
            break;
    }

    return(
        <div className="ProfileBlock">
            <UserIcon userIconUrl={serverController.userData.icon && serverController.getStaticLink(serverController.userData.icon)}/>
            <UserInfo info={
                {
                    name: username,
                    other: displayInfo,
                }
            } theme={chosenTheme}/>
            <div className="SmallButtonsBlock">
                {smallButtons.map(val => (
                    val
                ))}
            </div>
        </div>
    );
}

const Button = ({onClick = (onExit) => {}, getAnimation = (state) => (''), theme,
    children, text = ''}) => {
    const [animState, setAnimState] = useState(0);
    const [screen, setScreen] = useState(clientController.identifyScreenType());

    let anim = getAnimation(animState);
    useEffect(
        () => {
            function HandleResize(screen){
                setScreen(screen);
            }
            clientController.subscribeOn('resize', HandleResize);
            return () => {
                clientController.unSubscribeOn('resize', HandleResize);
            }
        }, []
    );

    if(screen == 'Desktop'){
        return(
            <DefaultButton text="" onClick={() => {
                    onClick(() => {
                    setAnimState(2);
                });
                setAnimState(1);
            }} styles={{
                width: '80%',
                position: 'relative',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                margin: '0 auto',
                marginBottom: '5%',
                gap: '2px',
                color: clientController.getColorSetting(theme, COLORS.text),
                backgroundColor: clientController.getColorSetting(theme, COLORS.functional),
                filter: 'none'
            }}>
                <SquareButton animation={anim}>{children}</SquareButton>
                <span style={{
                    // flex: 1,
                    textAlign: 'left',
                    fontSize: '16px'
                }}>{text}</span>
            </DefaultButton>
        )
    }

    return(
        <SquareButton animation={anim} onClick={() => {
                onClick(() => {
                setAnimState(2);
            });
            setAnimState(1);
        }}>{children}</SquareButton>
    )
}

const SquareButton = ({animation = '', onClick = () => {}, children}) => (
    <div className={`SquareButton ${animation}`}
    onClick={onClick}>
        {children}
    </div>
)