import React, { useEffect } from "react";
import { useState } from "react";
import '../assets/styles/ThemesToLearn.css';
import clientController, { COLORS } from "../application/ClientController";
import serverController from "../application/ServerController";

export const ThemesToLearnBlock = ({themesList = [{title: 'test', grade: 0, id: 0}], choosedThemeID = 0, setTheme = () => {}}) => {
    const [themes, setThemes] = useState(themesList);
    const [chosenTheme, setChoosedTheme] = useState(choosedThemeID);
    const [colorTheme, setColorTheme] = useState(clientController.theme);
    
    function updateChosenTheme(id){

        if(chosenTheme === id){
            setChoosedTheme(0);
            setTheme(0);
            serverController.chooseTheme(undefined);
            return false;
        }
        setChoosedTheme(id);
        setTheme(id);
        serverController.chooseTheme(themes[id-1].id);
        
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
        function updateSubjectList(){
            setThemes(serverController.subjectThemes);
        }

        clientController.subscribeOn('game-finish', updatePoints);
        clientController.subscribeOn('theme-switch', updateTheme);
        clientController.subscribeOn('subjectList-updated', updateSubjectList)

        return () => {
            clientController.unSubscribeOn('theme-switch', updateTheme);
            clientController.unSubscribeOn('game-finish', updatePoints);
            clientController.unSubscribeOn('subjectList-updated', updatePoints);
        }
    }, [])
    return(
        <div className="StatsCards">
            {themes.map(val => (
                <ThemeCard name={val.title} points={val.grade} key={val.id} theme={colorTheme}
                isChosen={val.id === chosenTheme} setChoosedCallback={(callback) => {
                    const res = updateChosenTheme(val.id);
                }}/>
            ))}
        </div>
    )
}

const ThemeCard = ({name, points, isChosen, setChoosedCallback = () => {}, theme}) => {
    const [isActive, setIsActive] = useState(isChosen);
    
    function setActive(){
        setChoosedCallback()
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