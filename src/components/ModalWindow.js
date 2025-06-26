import React, { useEffect, useReducer, useRef, useState } from "react";
import '../assets/styles/ModalWindow.css';
import { DefaultButton } from "./DefaultButton";
import clientController, { COLORS } from "../application/ClientController";


export const ModalWindow = ({children, title = 'undefined', size = 0,
    closeCallback, isBackgroundClose = true,
    defaultButton = {title: '', function: () => {}, isActive: false}}) => {
    
    const [chosenTheme, setTheme] = useState(clientController.theme);
    const [isLoading, setLoading] = useState(false);
    const [sizeState, setSize] = useState(size);

    useEffect(() => {
        setTimeout(() => {setLoading(true)}, 50);
        function updateTheme(){
            setTheme(clientController.theme);
        }
        clientController.subscribeOn('theme-switch', updateTheme);

        return () => {
            clientController.unSubscribeOn('theme-switch', updateTheme);
        }
    }, []);

    function exitFunction(isBackground){
        if(isLoading && (isBackgroundClose || !isBackground)){
            setLoading(false); 
            setTimeout(() => closeCallback(), 200);
        }
    }

    let backdropFilter;
    let modalStyles = {
        top: '120vh',
        backgroundColor: clientController.getColorSetting(chosenTheme, COLORS.functional),
        height: sizeState === 0? '45vh': '65vh'
    };
    if(isLoading){
        backdropFilter = 'blur(3px)'
        modalStyles.top = sizeState === 0? '27.5vh': '17.5vh';
    }
    let button;
    if(defaultButton.isActive){
        button = <DefaultButton styles={{width: '90%', height: '8vh', left: '5%', bottom: '5%', fontWeight: '700',
            backgroundColor: `var(--main-button-dark-color)`, color: 'var(--main-text-dark-color)'}} text={defaultButton.title}
            onClick={async () => {
                let isCanExit = true;
                
                if(!!defaultButton.function){
                    isCanExit = !!(await defaultButton.function());
                    console.log(isCanExit);
                }
                if(isCanExit) exitFunction(false);
            }}
            />
    }
    
    return(
        <div className="ModalWindowBase" onClick={() => exitFunction(true)} style={{backdropFilter}}>
            <div className="ModalWindow" style={modalStyles} onClick={(ev) => {
                    ev.stopPropagation();
                }}>
                <p className="ModalTitle DefaultFont" 
                style={{color: clientController.getColorSetting(chosenTheme, COLORS.text)}}>
                    {title}
                </p>
                {children}
                {button}
            </div>
        </div>
    );
};
