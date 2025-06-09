import React, { useEffect } from "react";
import { useState } from "react";
import '../assets/styles/ThemesToLearn.css';

let lastChosenCallback = () => {};

export const ThemesToLearnBlock = ({themesList = [{themeName: 'test', points: 0, id: 0,}], choosedThemeID = 0, setTheme = () => {}}) => {
    const [themes, setThemes] = useState(themesList);
    const [chosenTheme, setChoosedTheme] = useState(choosedThemeID);
    
    function updateChosenTheme(id, callback){
        lastChosenCallback();
        lastChosenCallback = callback;
        
        if(chosenTheme === id){
            setChoosedTheme(0);
            setTheme(0);
            return false;
        }
        setChoosedTheme(id);
        setTheme(id);
        return true;
    }

    return(
        <div className="StatsCards">
            {themes.map(val => (
                <ThemeCard info={val} name={val.themeName} points={val.points} key={val.id} 
                isChosen={val.id === chosenTheme} setChoosedCallback={(callback) => {
                    const res = updateChosenTheme(val.id, callback);
                    console.log(res);
                    return res;
                }}/>
            ))}
        </div>
    )
}

const ThemeCard = ({info, name, points, isChosen, setChoosedCallback = () => {}}) => {
    const [isActive, setIsActive] = useState(isChosen);

    function setActive(){
        setIsActive(setChoosedCallback(() => {setIsActive(false);}));
    }

    return(
        <div className="ThemeCard" onClick={setActive} style={{borderColor: isActive? `var(--border-dark-active)`: ''}}>
            <div className="ThemeInfoWrapper">
                <div className="DefaultFont" style={{color: `var(--main-text-dark-color)`, fontSize: '24px'}}>{points}</div>
                <div className="DefaultFont" style={{color: `var(--secondary-text-dark-color)`, fontSize: '14px'}}>{name}</div>
            </div>
        </div>
    )
}