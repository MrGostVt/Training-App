import React, { useState } from "react";
import { ProfileBlock } from "../components/ProfileBlock";
import { PagePreview } from "../components/PagePreview";
import { ThemesToLearnBlock } from "../components/ThemesToLearnBlock";
import { GameBlock } from "../components/GameBlock";
import { LoadedImages } from "../application/ImageLoad";

export const MainPage = ({}) =>{
    const [chosenTheme, setTheme] = useState(0);
    
    return(
        <>
            <ThemesToLearnBlock themesList={[
                {themeName: 'Math', points: 100, id: 1,},
                {themeName: 'English', points: 50, id: 2,},
                {themeName: 'Logic', points: 0, id: 3,},
                {themeName: '...', points: 0, id: 4,},
                {themeName: '...', points: 0, id: 5,}]}
                setTheme={setTheme}
            />
            <GameBlock GameInfo={{
                type: 'Practice',
                typeDescripe: 'Quick game',
                description: 'Play a quick practice to improve your skills',
                iconUrl: LoadedImages['Practice.png'],
            }}/>;
            <GameBlock GameInfo={{
                type: 'Tournament',
                typeDescripe: 'Tournament match',
                description: 'Join to tournament and show your skills',
                iconUrl: LoadedImages['Tournament.png'],
            }}/>
        </>
    );
}