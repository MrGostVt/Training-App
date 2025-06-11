import React, { useEffect, useState } from "react";
import { ProfileBlock } from "../components/ProfileBlock";
import { PagePreview } from "../components/PagePreview";
import { ThemesToLearnBlock } from "../components/ThemesToLearnBlock";
import { GameBlock } from "../components/GameBlock";
import { LoadedImages } from "../application/ImageLoad";
import serverController from "../application/ServerController";

export const MainPage = ({moveToGame = () => {}}) =>{
    const [chosenTheme, setTheme] = useState(serverController.currentTheme);
    
    let barrier;
    if(chosenTheme <= 0){
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
        serverController.currentTheme = chosenTheme;
    }, [chosenTheme])
    return(
        <>
            <ThemesToLearnBlock themesList={[
                {themeName: 'Math', points: 100, id: 1,},
                {themeName: 'English', points: 50, id: 2,},
                {themeName: 'Logic', points: 0, id: 3,},
                {themeName: '...', points: 0, id: 4,},
                {themeName: '...', points: 0, id: 5,}]}
                setTheme={setTheme} choosedThemeID={chosenTheme}
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
            }} moveToGame={moveToGame}/>
        </>
    );
}