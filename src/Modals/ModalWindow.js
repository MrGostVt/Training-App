import React, { useEffect, useReducer, useRef, useState } from "react";
import '../assets/styles/ModalWindow.css';
import { DefaultButton } from "../components/DefaultButton";
// import clientController, { COLORS } from "../application/ClientController";
import clientController, {COLORS} from "../application/ClientController";


export const ModalWindow = ({
    children, title = 'undefined', size = 0,
    closeCallback, isBackgroundClose = true,
    defaultButton = {title: '', type: '', function: () => {}, isActive: false, styles: {}},
    wrapStyles = {},
}) => {
    
    const [chosenTheme, setTheme] = useState(clientController.theme);
    const [isLoading, setLoading] = useState(false);
    const [sizeState, setSize] = useState(size);
    const [screen, setScreen] = useState(clientController.screenType);

    useEffect(() => {
        setTimeout(() => {setLoading(true)}, 50);
        function updateTheme(){
            setTheme(clientController.theme);
        }
        function handleResize(type){
            setScreen(type);
        }
        clientController.subscribeOn('theme-switch', updateTheme);
        clientController.subscribeOn('resize', handleResize);

        return () => {
            clientController.unSubscribeOn('theme-switch', updateTheme);
            clientController.unSubscribeOn('resize', handleResize);
        }
    }, []);

    useEffect(() => setSize(size),[size]);

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
    };
    if(isLoading){
        backdropFilter = 'blur(3px)'
    }
    switch(sizeState){
        case 3: modalStyles.height = screen === 'Desktop'? '55vh':'390px'; if(isLoading) modalStyles.top = '0vh'; break;
        case 2: modalStyles.height = screen === 'Desktop'? '85vh':'690px'; if(isLoading) modalStyles.top = '0vh'; break;
        case 1: modalStyles.height = screen === 'Desktop'? '65vh':'490px'; if(isLoading) modalStyles.top = '0vh'; break;
        default: modalStyles.height = screen === 'Desktop'? '45vh':'310px'; if(isLoading) modalStyles.top = '0vh';break;
    }
    
    let button;
    if(defaultButton.isActive){
        button = <DefaultButton styles={{width: '90%', height: '8vh', left: '5%', bottom: '2.5vh', fontWeight: '700',
            backgroundColor: clientController.getColorSetting(chosenTheme, COLORS.button),
             color: 'var(--main-text-dark-color)', ...defaultButton.styles}} 
            text={defaultButton.title}
            onClick={async () => {
                let isCanExit = true;
                
                if(!!defaultButton.function){
                    isCanExit = !!(await defaultButton.function());
                    console.log(isCanExit);
                }
                if(isCanExit) exitFunction(false);
            }}
            type = {defaultButton.type}
        />
    }
    
    return(
        <div className="ModalWindowBase" onClick={() => exitFunction(true)} style={{backdropFilter}}>
            <div className="ModalWindow" style={{...modalStyles, ...wrapStyles}} onClick={(ev) => {
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
