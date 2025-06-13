import React, { useEffect } from "react";
import { useState } from "react";
import '../assets/styles/ThemesToLearn.css';
import clientController, { COLORS } from "../application/ClientController";

export const ThemesToLearnBlock = ({themesList = [{themeName: 'test', points: 0, id: 0,}], choosedThemeID = 0, setTheme = () => {}}) => {
    const [themes, setThemes] = useState(themesList);
    const [chosenTheme, setChoosedTheme] = useState(choosedThemeID);
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

    console.log(chosenTheme);
    return(
        <div className="StatsCards">
            {themes.map(val => (
                <ThemeCard info={val} name={val.themeName} points={val.points} key={val.id} 
                isChosen={val.id === chosenTheme} setChoosedCallback={(callback) => {
                    const res = updateChosenTheme(val.id);
                }}/>
            ))}
        </div>
    )
}

const ThemeCard = ({info, name, points, isChosen, setChoosedCallback = () => {}}) => {
    const [isActive, setIsActive] = useState(isChosen);
    const [chosenTheme, setTheme] = useState(clientController.theme);
    
    function setActive(){
        setChoosedCallback()
    }
    if(isChosen){
        console.log("choseeen!")
    }
    useEffect(() => {
        function updateTheme(){
            setTheme(clientController.theme);
        }
        clientController.subscribeOn('theme-switch', updateTheme);

        return () => {
            clientController.unSubscribeOn('theme-switch', updateTheme);
        }
    }, []);

    useEffect(() => {
        setIsActive(isChosen);
    }, [isChosen]);

    return(
        <div className="ThemeCard" onClick={setActive} 
        style={{borderColor: isActive? 
            clientController.getColorSetting(chosenTheme, COLORS.borderA): 
            clientController.getColorSetting(chosenTheme, COLORS.border),
        }}>
            <div className="ThemeInfoWrapper">
                <div className="DefaultFont" style={{color: clientController.getColorSetting(chosenTheme, COLORS.text), fontSize: '24px'}}>{points}</div>
                <div className="DefaultFont" style={{color:  clientController.getColorSetting(chosenTheme, COLORS.text2), fontSize: '14px'}}>{name}</div>
            </div>
        </div>
    )
}