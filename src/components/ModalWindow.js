import React, { useEffect, useState } from "react";
import '../assets/styles/ModalWindow.css';
import { DefaultButton } from "./DefaultButton";

export const ModalWindow = ({children, title = 'undefined', closeCallback = () => {}}) => {
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        setTimeout(() => {setLoading(true)}, 50);
    }, []);

    let backdropFilter;
    let modalStyles = {
        top: '120vh',
    };
    if(isLoading){
        backdropFilter = 'blur(3px)'
        modalStyles.top = '27.5vh';
    }
    
    return(
        <div className="ModalWindowBase" onClick={() => {
            if(isLoading ){
                setLoading(false); 
                setTimeout(() => closeCallback(), 200);
            }}} style={{backdropFilter}}>
            <div className="ModalWindow" style={modalStyles} onClick={(ev) => {
                    ev.stopPropagation();
                }}>
                <p className="ModalTitle DefaultFont" style={{color: `var(--main-text-dark-color)`}}>{title}</p>
                {children}
            </div>
        </div>
    );
};

export const SettingsModal = ({closeCallback = () => {}}) => {

    return(
        <ModalWindow title="Settings" closeCallback={closeCallback}>
            <DefaultButton styles={{width: '90%', height: '8vh', left: '5%', bottom: '5%', fontWeight: '700',
            backgroundColor: `var(--main-button-dark-color)`, color: 'var(--main-text-dark-color)'}} text="SIGN OUT"
            />
        </ModalWindow>
    );
}

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
        <ModalWindow title={signType === 0? 'Sign Up': 'Sign In'} >

            <DefaultButton styles={{width: '90%', height: '8vh', left: '5%', bottom: '15%', fontWeight: '700',
                backgroundColor: `var(--main-button-dark-color)`, color: 'var(--main-text-dark-color)'}} text="SIGN IN"
            />
            {signMessage}
        </ModalWindow>
    );
}