import React, { useEffect, useState } from "react";
import '../assets/styles/ModalWindow.css';
import { DefaultButton } from "./DefaultButton";
import clientController, { COLORS } from "../application/ClientController";

export const ModalWindow = ({children, title = 'undefined', closeCallback, defaultButton = {title: '', function: () => {}, isActive: false}}) => {
    const [chosenTheme, setTheme] = useState(clientController.theme);
    const [isLoading, setLoading] = useState(false);

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

    function exitFunction(){
        if(isLoading && typeof closeCallback === 'function'){
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
        modalStyles.top = '27.5vh';
    }
    let button;
    if(defaultButton.isActive){
        button = <DefaultButton styles={{width: '90%', height: '8vh', left: '5%', bottom: '5%', fontWeight: '700',
            backgroundColor: `var(--main-button-dark-color)`, color: 'var(--main-text-dark-color)'}} text={defaultButton.title}
            onClick={() => {
                if(!!defaultButton.function){
                    defaultButton.function();
                }
                exitFunction();
            }}
            />
    }
    
    return(
        <div className="ModalWindowBase" onClick={exitFunction} style={{backdropFilter}}>
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

export const SettingsModal = ({closeCallback = () => {}}) => {

    return(
        <ModalWindow title="Settings" closeCallback={closeCallback} defaultButton={{isActive: true, title: 'SIGN OUT'}}>
            <ThemeSwitch />
        </ModalWindow>
    );
}

const ThemeSwitch = ({}) => {
    const [chosenTheme, setTheme] = useState(clientController.theme);
    const text = !!chosenTheme? 'Dark': 'Light'

    return(
        <div className="ThemeSwitch DefaultFont" onClick={() => {
            setTheme(!!chosenTheme? 0: 1);
            clientController.switchTheme();
        }} style={{fontSize: '20px', color: clientController.getColorSetting(chosenTheme, COLORS.text)}}>
            Theme
            <div className="ThemeButton" 
            style={{backgroundColor: clientController.getColorSetting(chosenTheme, COLORS.functionalA)}}>
                {text}
            </div>
        </div>
    )
};

const messageStyles = {
    position: 'absolute',
    left: '5%',
    bottom: '5%',
    color: 'var(--main-text-dark-color)',
    width: '90%',
    textAlign: 'center',
};
export const SignModal = ({}) => {
    const [signType, setSignType] = useState(0);

    let signMessage = <div className="DefaultFont" style={messageStyles} onClick={() => {setSignType(1)}}>New user? Sign Up</div>;
    if(signType === 1){
        signMessage = <div className="DefaultFont" style={messageStyles} onClick={() => {setSignType(0)}}>Already have an account? Sign In</div>
    }

    return(
        <ModalWindow title={signType === 0? 'Sign Up': 'Sign In'}  defaultButton={{isActive: true, title: 'SIGN IN'}}>

            {/* <DefaultButton styles={{width: '90%', height: '8vh', left: '5%', bottom: '15%', fontWeight: '700',
                backgroundColor: `var(--main-button-dark-color)`, color: 'var(--main-text-dark-color)'}} text="SIGN IN"
            /> */}
            {signMessage}
        </ModalWindow>
    );
}

export const ResultsModal = ({type, results, closeCallback = () => {}}) => {
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
        <ModalWindow title={type} closeCallback={closeCallback} defaultButton={{isActive: true, title: 'Claim', function: () => {}}}>
            <ResultsDisplay results={results} theme={chosenTheme}/>
        </ModalWindow>
    );
}

//results = [[points, maxPoints]]
const ResultsDisplay = ({results = [], theme}) => {
    
    return(
        <div className="ResultsDisplay">
            {results.map((val, i) => (
                <div className="ResultWrap" style={{
                    backgroundColor: clientController.getColorSetting(theme, COLORS.functionalA),
                    color: clientController.getColorSetting(theme, COLORS.text)
                    }} key={i}>
                    <div className="DefaultFont" style={{marginLeft: '5px'}}>{` Question №${i+1}:`}</div>
                    <div className="DefaultFont" style={{
                        position: 'relative',
                        width: '50px',
                        textAlign: 'center',
                        backgroundColor: val[0] === val[1]? 'yellowgreen': val[0] !== 0? 'orange': '#cb0000',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                    }}>{` ${val[0]}/${val[1]}`}</div>
                </div>
            ))}
        </div>
    );
}