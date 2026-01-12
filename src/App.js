import React, { useEffect, useState } from "react";
import './assets/styles/App.css';
import { MainPage } from "./pages/MainPage";
import { PagePreview } from "./components/PagePreview";
import { ProfileBlock } from "./components/ProfileBlock";
import { InGamePage } from "./pages/InGamePage";
import { ProcessQuestionsModal } from "./components/ProcessQuestionsModal";
import { ResultsModal } from "./components/ResultsModal";
import { SettingsModal } from "./components/SettingsModal";
import { SignModal } from "./components/SignModal";
import clientController, { COLORS } from "./application/ClientController";
import serverController from "./application/ServerController";
import { Tip } from "./components/Tip";


const SavedInstance = {
    'tip': {callback: () => {}, others: {
        text: '', color: undefined
    }, queue: []},
    1: () => {},
};

const App = ({}) => {
    const [pageId, setPage] = useState(0);
    const [modal, setModal] = useState(0);
    const [tipState, setTipState] = useState(false);

    const [chosenTheme, setTheme] = useState(clientController.theme);

    useEffect(() => {
        function updateTheme(){
            setTheme(clientController.theme);
        }

        function onUnauthorized(){
            openModal(2, () => {});
        }

        function onForbidden(){

        }

        clientController.subscribeOn('theme-switch', updateTheme);
        clientController.subscribeOn('unauthorized', onUnauthorized );
        clientController.subscribeOn('forbidden', onForbidden);
        clientController.subscribeOn('show-tip', showTip); // добавить возможность выбирать цвет для подсказки.

        // async function name(params) {
        //     await serverController.getUserData();
        // }


        // openModal(2, () => {});
        // openModal(4, () => {}); 

        serverController.getUserData();
        serverController.getSubjectThemes();

        return () => {
            clientController.unSubscribeOn('theme-switch', updateTheme);
            clientController.unSubscribeOn('unauthorized', onUnauthorized);
            clientController.unSubscribeOn('forbidden', onForbidden);
            clientController.unSubscribeOn('show-tip', showTip);

        }
    }, []);

    let page;
    switch(pageId){
        case 1: page = <InGamePage moveOut = {moveOutFromGame}/>; break;
        case 0: page = <MainPage moveToGame={moveToGame}/>; break;
        default: page = null;
    }

    let modalWindow;
    switch(modal){
        case 1: modalWindow = <SettingsModal closeCallback={SavedInstance[1].callback} />; break;
        case 2: modalWindow = <SignModal closeCallback={SavedInstance[2].callback}/>; break;
        case 3: modalWindow = <ResultsModal type={"Practice"} results={SavedInstance[3].others} closeCallback={SavedInstance[3].callback}/>; break;
        case 4: modalWindow = <ProcessQuestionsModal closeCallback={SavedInstance[4].callback} />; break;
        default: modalWindow = null; break;
    }

    let tip;
    if(tipState){
        tip = <Tip tip={SavedInstance['tip'].others.text} opacity={SavedInstance['tip'].others.opacity}
            color={SavedInstance['tip'].others.color}    
        onClose={() => {setTipState(false); }}/>;
    }

    function openModal(id, callback, others){
        SavedInstance[id] = {
            callback: () =>{
                setModal(0);
                callback();
            }
        };
        SavedInstance[id].others = others;

        setModal(id);
    }
    function moveToGame(id){
        serverController.startGame();
        setPage(1);
    }
    function moveOutFromGame(results, isActive = true){
        setPage(0);
        if(isActive){
            console.log(results);
            const sum = results.reduce((acc, curr) => {
                return acc.length === undefined? acc + curr[0]: curr[0] + acc[0];
            });
            openModal(3, () => {serverController.finishGame(sum, clientController.subjectTheme)}, results);
        }
    }
    function showTip([text = '', color = clientController.getColorSettingDefault('mainText')]){
        if(tipState != true){
            SavedInstance['tip'].others = {
                text, color,
            };
            // SavedInstance['tip'].queue.push(1); ДОБАВИТЬ ОЧЕРЕДЬ УВЕДОМЛЕНИЙ
            setTipState(true);
        }
    }

    return(
        <div className="App" style={{backgroundColor: clientController.getColorSetting(chosenTheme, COLORS.main)}}>
            <PagePreview text="Trainee-App"/>
            <ProfileBlock openModal = {openModal}/>
            {page}
            {modalWindow}
            {tip}
        </div>
    )
}

export default App;