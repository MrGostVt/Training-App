import React, { useEffect, useState } from "react";
import { ProfileBlock } from "../components/ProfileBlock";
import { PagePreview } from "../components/PagePreview";
import { ThemesToLearnBlock } from "../components/ThemesToLearnBlock";
import { GameBlock } from "../components/GameBlock";
import { LoadedImages } from "../application/ImageLoad";
import serverController from "../application/ServerController";
import clientController from "../application/ClientController";

export const MainPage = ({moveToGame = () => {}}) =>{
    const [chosenSubject, setSubject] = useState(clientController.subjectTheme);
    let barrier;
    if(chosenSubject <= 0){
        barrier = <div className="DefaultFont" style={{
            position: 'absolute', 
            left: '4%', 
            width: '92%', 
            height: 'calc(48vh + 5%)',
            zIndex: '10',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '24px',
            color: 'var(--main-text-dark-color)',
        }}>Choose theme first</div>
    }

    useEffect(() => {
        clientController.setSubject(chosenSubject);
    }, [chosenSubject]);

    useEffect(() => {
        function handleChosenSubject(){
            const current = serverController.userData.chosenTheme;
            console.log('HANDLE HANDLEVOCH');
            console.log(current);

            if(current.id != chosenSubject) setSubject(current.id);
        }
        clientController.subscribeOn('userdata-loaded', handleChosenSubject);
        
        return () => clientController.unSubscribeOn('userdata-loaded', handleChosenSubject);
    }, [])



    return(
        <>
            <ThemesToLearnBlock themesList={serverController.subjectThemes}
                setTheme={setSubject} chosenSubject={chosenSubject}
            />
            {barrier}
            <GameBlock GameInfo={{
                type: 'Practice',
                typeDescripe: 'Quick game',
                description: 'Play a quick practice to improve your skills',
                iconUrl: LoadedImages['Practice.png'],
                typeId: 1,
            }} moveToGame={moveToGame}/>
            <GameBlock GameInfo={{
                type: 'Tournament',
                typeDescripe: 'Tournament match',
                description: 'Join to tournament and show your skills',
                iconUrl: LoadedImages['Tournament.png'],
                typeId: 2,
            }} moveToGame={() => {clientController.triggerEvent('show-tip', ['Coming soon!', clientController.getColorSetting(2, 'yellow')])}}/>
        </>
    );
}