import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { DefaultButton } from "../components/DefaultButton";
import clientController from "../application/ClientController";

export const ModalButton = forwardRef(({text = '', onClick = () => {}, exit = () => {}, styles = {}}, ref) => {
    const [isLoading, setLoading] = useState(false);
    const [screen, setScreen] = useState(clientController.identifyScreenType());
    const position = {bottom: '-20vh'};
    const defaultStyles = {left: 'calc(50vw + 150px)', width: '60%', transform: 'translateX(-50%)'}

    useEffect(() => {
        setTimeout(() => setLoading(true), 50);
        function handleResize(type){
            setScreen(type);
        }

        clientController.subscribeOn('resize', handleResize);
        return () => {
            clientController.unSubscribeOn('resize', handleResize);
        };
    }, []);

    function close(){
        setLoading(false);
        setTimeout(() => exit(), 50);
    }
    useImperativeHandle(ref, () => ({
        close
    }));

    if(isLoading){
        position.bottom = '5vh'
    }
    if(screen === 'Mobile'){
        defaultStyles.left = '5%';
        defaultStyles.width = '90%';
        defaultStyles.transform = '';
    }

    return(
        <DefaultButton text={text} onClick={() => {
            onClick();
            close();
        }} styles={{
            position: 'fixed',
            transition: '.3s',
            fontWeight: 600, fontSize: '18px',
            ...styles,
            ...defaultStyles,
            ...position
        }}/>
    );
})