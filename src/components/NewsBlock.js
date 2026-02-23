import React, { useEffect, useState } from "react";
import clientController from "../application/ClientController";

export const NewsBlock = ({}) =>{
    const [chosenTheme, setTheme] = useState(clientController.theme);
    const [screen, setScreen] = useState(clientController.identifyScreenType());

    useEffect(() => {
        function updateTheme(){
            setTheme(clientController.theme);
        }
        function handleScreenUpdate(type){
            setScreen(type);
            console.log(type);
        }

        clientController.subscribeOn('theme-switch', updateTheme);
        clientController.subscribeOn('resize', handleScreenUpdate);

        return () => {
            clientController.unSubscribeOn('theme-switch', updateTheme);
            clientController.unSubscribeOn('resize', handleScreenUpdate);
        }
    }, []);
    
    return(
        <div className="NewsBlock" style={{
            marginTop: screen == 'Desktop'? '2.5vh': 0,
        }}>

        </div>
    )
}