import React, { useEffect, useState } from "react";
import { ProfileBlock } from "../components/ProfileBlock";
import { PagePreview } from "../components/PagePreview";
import { ThemesToLearnBlock } from "../components/ThemesToLearnBlock";
import { GameBlock } from "../components/GameBlock";
import { LoadedImages } from "../application/ImageLoad";
import serverController from "../application/ServerController";
import clientController, { COLORS } from "../application/ClientController";
import { NewsBlock } from "../components/NewsBlock";

export const MainPage = ({moveToGame = () => {}, callButton = () => {}, moveButtonAway = () => {}}) =>{
    const [chosenSubject, setSubject] = useState(clientController.subjectTheme);
    const [chosenGame, setGame] = useState(undefined);

    let barrier;
    if(chosenSubject <= 0){
        barrier = <div style={{
            position: 'absolute', 
            width: '100%', 
            height: '100%',
            zIndex: '10',
            backdropFilter: 'blur(3px)',
            transform: 'translateY(-5%)'
        }}></div>
    }

    useEffect(() => {
        clientController.setSubject(chosenSubject);
        if(chosenSubject <= 0 && chosenGame !== undefined){moveButtonAway(); chosenGame.onNew(); setGame(undefined);}
    }, [chosenSubject]);

    useEffect(() => {
        function handleChosenSubject(){
            const current = serverController.userData.chosenTheme;

            if(current.id != chosenSubject) setSubject(current.id);
        }
        clientController.subscribeOn('userdata-loaded', handleChosenSubject);
        
        return () => clientController.unSubscribeOn('userdata-loaded', handleChosenSubject);
    }, [])

    function HandleChoose({type, onNew}){
        if(chosenGame !== undefined && type === chosenGame.type) {
            setGame(undefined);
            moveButtonAway()
            return false;
        }
        
        if(chosenGame !== undefined) {chosenGame.onNew();}
        setGame({type, onNew});
        callButton(() => {
            setGame(undefined);
            onNew();
            if(type == 2) clientController.triggerEvent('show-tip', ['Coming soon!', clientController.getColorSetting(2, 'yellow')])
            else moveToGame(type);
        }, 'Start', {color: clientController.getColorSettingDefault(COLORS.text4)});
        return true;
    }

    return(
        <>  
            <NewsBlock></NewsBlock>
            <ThemesToLearnBlock themesList={serverController.subjectThemes}
                setTheme={setSubject} chosenSubject={chosenSubject}
            />
            <div className="GameBlockField">
                <GameBlock GameInfo={{
                    type: 'Practice',
                    typeDescripe: 'Quick game',
                    description: 'Play a quick practice to improve your skills',
                    iconUrl: LoadedImages['Practice.png'],
                    typeId: 1,
                }} moveToGame={moveToGame} setActive={HandleChoose}/>
                <GameBlock GameInfo={{
                    type: 'Tournament',
                    typeDescripe: 'Tournament match',
                    description: 'Join to tournament and show your skills',
                    iconUrl: LoadedImages['Tournament.png'],
                    typeId: 2,
                }} setActive={HandleChoose}/>
                {barrier}
            </div>
            
        </>
    );
}