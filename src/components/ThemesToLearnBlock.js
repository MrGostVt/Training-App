import React, { useEffect } from "react";
import { useState } from "react";
import '../assets/styles/ThemesToLearn.css';
import clientController, { COLORS } from "../application/ClientController";
import serverController from "../application/ServerController";

export const ThemesToLearnBlock = ({themesList = [{title: 'test', grade: 0, id: 0}], chosenSubject = -1, setTheme = () => {}, showPopUp = () => {}}) => {
    const [themes, setThemes] = useState(themesList);
    const [chosen, choose] = useState(chosenSubject);
    const [colorTheme, setColorTheme] = useState(clientController.theme);
    
    function updateChosenSubject(id){

        if(chosen === id){
            choose(-1);
            setTheme(-1);
            serverController.chooseTheme(undefined);
            return false;
        }
        choose(id);
        setTheme(id);
        
        const theme = themes.filter((val) => val.id === id)[0];
        serverController.chooseTheme(theme.id, theme.title);
        
        return true;
    }
    useEffect(() => {
        choose(chosenSubject);
    }, [chosenSubject]);

    useEffect(() => {
        function updateTheme(){
            setColorTheme(clientController.theme);
        }
        function updatePoints({subject, points}){
            const subjects = [...themes];

            const index = subjects.findIndex((val) => val.id === subject);
            subjects[index].grade = parseInt(points) + parseInt(subjects[index].grade);
            setThemes(subjects);
        }
        function updateSubjectList(){
            setThemes(serverController.subjectThemes);
        }
        
        clientController.subscribeOn('game-finish', updatePoints);
        clientController.subscribeOn('theme-switch', updateTheme);
        clientController.subscribeOn('subjectList-updated', updateSubjectList);

        return () => {
            clientController.unSubscribeOn('theme-switch', updateTheme);
            clientController.unSubscribeOn('game-finish', updatePoints);
            clientController.unSubscribeOn('subjectList-updated', updatePoints);
        }
    }, []);

    let createButton = null;
    if(serverController.userData.accessLevel === 3){
        createButton = <ThemeCard name={'Theme'} points={'Create'} theme={colorTheme} setChoosedCallback={() => {
            showPopUp(1, () => {});
        }} />
    }

    return(
        <div className="StatsCards">
            {themes.map(val => (
                <ThemeCard name={val.title} points={val.grade} key={val.id} theme={colorTheme}
                isChosen={val.id === chosen} setChoosedCallback={(callback) => {
                    const res = updateChosenSubject(val.id);
                }}/>
            ))}
            {createButton}
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
        style={{
            backgroundColor: clientController.getColorSetting(theme, COLORS.main),
            border: isActive? 
                'solid 2px ' + clientController.getColorSetting(theme, COLORS.button)
                : 'solid 2px ' + clientController.getColorSetting(theme, COLORS.main),
        }}>
            <div className="ThemeInfoWrapper">
                <div className="DefaultFont" style={{color: clientController.getColorSetting(theme, COLORS.text), fontSize: '24px', fontWeight: '600'}}>{points}</div>
                <div className="DefaultFont" style={{color:  clientController.getColorSetting(theme, COLORS.text3), fontSize: '14px'}}>{name}</div>
            </div>
        </div>
    )
}