import React, { useEffect } from "react";
import { useState } from "react";
import '../assets/styles/ThemesToLearn.css';
import clientController, { COLORS } from "../application/ClientController";

export const ThemesToLearnBlock = ({themesList = [{themeName: 'test', points: 0, id: 0,}], choosedThemeID = 0, setTheme = () => {}}) => {
    const [themes, setThemes] = useState(themesList);
    const [chosenTheme, setChoosedTheme] = useState(choosedThemeID);
    const [colorTheme, setColorTheme] = useState(clientController.theme);
    
    function updateChosenTheme(id){

        if(chosenTheme === id){
            setChoosedTheme(0);
            setTheme(0);
            return false;
        }
        setChoosedTheme(id);
        setTheme(id);
        return true;
    }

    useEffect(() => {
        function updateTheme(){
            setColorTheme(clientController.theme);
        }
        function updatePoints({subject, points}){
            const subjects = [...themes];

            const index = subjects.findIndex((val) => val.id === subject);
            subjects[index].points = parseInt(points) + parseInt(subjects[index].points);
            setThemes(subjects);
        }
        clientController.subscribeOn('game-finish', updatePoints);
        clientController.subscribeOn('theme-switch', updateTheme);

        return () => {
            clientController.unSubscribeOn('theme-switch', updateTheme);
            clientController.unSubscribeOn('game-finish', updatePoints);
        }
    }, [])
    return(
        <div className="StatsCards">
            {themes.map(val => (
                <ThemeCard info={val} name={val.themeName} points={val.points} key={val.id} theme={colorTheme}
                isChosen={val.id === chosenTheme} setChoosedCallback={(callback) => {
                    const res = updateChosenTheme(val.id);
                }}/>
            ))}
        </div>
    )
}

const ThemeCard = ({info, name, points, isChosen, setChoosedCallback = () => {}, theme}) => {
    const [isActive, setIsActive] = useState(isChosen);
    
    function setActive(){
        setChoosedCallback()
    }
    if(isChosen){
        console.log("choseeen!")
    }

    useEffect(() => {
        setIsActive(isChosen);
    }, [isChosen]);

    return(
        <div className="ThemeCard" onClick={setActive} 
        style={{borderColor: isActive? 
            clientController.getColorSetting(theme, COLORS.borderA): 
            clientController.getColorSetting(theme, COLORS.border),
        }}>
            <div className="ThemeInfoWrapper">
                <div className="DefaultFont" style={{color: clientController.getColorSetting(theme, COLORS.text), fontSize: '24px'}}>{points}</div>
                <div className="DefaultFont" style={{color:  clientController.getColorSetting(theme, COLORS.text2), fontSize: '14px'}}>{name}</div>
            </div>
        </div>
    )
}