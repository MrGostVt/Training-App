import React, { useEffect, useRef, useState } from "react";
import './assets/styles/App.css';
import { MainPage } from "./pages/MainPage";
import { PagePreview } from "./components/PagePreview";
import { ProfileBlock } from "./components/ProfileBlock";
import { InGamePage } from "./pages/InGamePage";
import { ProcessQuestionsModal } from "./Modals/ProcessQuestionsModal";
import { ResultsModal } from "./Modals/ResultsModal";
import { SettingsModal } from "./Modals/SettingsModal";
import { SignModal } from "./Modals/SignModal";
import clientController, { COLORS } from "./application/ClientController";
import serverController from "./application/ServerController";
import { Tip } from "./components/Tip";
import { PaintModal } from "./Modals/PaintModal";
import { ModalButton } from "./Modals/ModalButton";

const SavedInstance = {
    'tip': {callback: () => {}, others: {
        text: '', styles: undefined
    }, queue: []},
    'modalButton': {callback: () => {}, others: {
        text: '', color: undefined
    }},
    1: () => {},
};

const App = ({}) => {
    const [pageId, setPage] = useState(0);
    const [modal, setModal] = useState(0);
    const [tipState, setTipState] = useState(false);
    const [screen, setScreen] = useState(clientController.identifyScreenType());
    const [chosenTheme, setTheme] = useState(clientController.theme);
    const [modalButton, setModalButton] = useState(false);
    const [,forceUpdate] = useState(0);

    useEffect(() => {
        function updateTheme(){
            setTheme(clientController.theme);
        }

        function onUnauthorized(){
            openModal(2, () => {});
        }

        function onForbidden(){

        }
        function handleResize(type){
            setScreen(type);
        }

        clientController.subscribeOn('theme-switch', updateTheme);
        clientController.subscribeOn('unauthorized', onUnauthorized );
        clientController.subscribeOn('forbidden', onForbidden);
        clientController.subscribeOn('show-tip', showTip); // добавить возможность выбирать цвет для подсказки.
        clientController.subscribeOn('resize', handleResize);

        serverController.getUserData();
        serverController.getSubjectThemes();

        return () => {
            clientController.unSubscribeOn('theme-switch', updateTheme);
            clientController.unSubscribeOn('unauthorized', onUnauthorized);
            clientController.unSubscribeOn('forbidden', onForbidden);
            clientController.unSubscribeOn('show-tip', showTip);
            clientController.unSubscribeOn('resize', handleResize);
        }
    }, []);

    let page;
    const buttonRef = useRef();
    switch(pageId){
        case 1: page = <InGamePage moveOut = {moveOutFromGame}/>; break;
        case 0: page = <MainPage moveToGame={moveToGame} callButton={showModalButton} moveButtonAway={() => buttonRef.current.close()}/>; break;
        default: page = null;
    }

    let modalWindow;
    switch(modal){
        case 1: modalWindow = <SettingsModal closeCallback={SavedInstance[1].callback} />; break;
        case 2: modalWindow = <SignModal closeCallback={SavedInstance[2].callback}/>; break;
        case 3: modalWindow = <ResultsModal type={"Practice"} results={SavedInstance[3].others} closeCallback={SavedInstance[3].callback}/>; break;
        case 4: modalWindow = <ProcessQuestionsModal closeCallback={SavedInstance[4].callback} />; break;
        case 5: modalWindow = <PaintModal closeCallback={SavedInstance[5].callback} tiptext={SavedInstance[5].others}/>; break;
        default: modalWindow = null; break;
    }

    let tip;
    if(tipState){
        tip = <Tip tip={SavedInstance['tip'].others.text} opacity={SavedInstance['tip'].others.opacity}
            color={SavedInstance['tip'].others.color}    
        onClose={() => {setTipState(false); }}/>;
    }
    let button;
    if(modalButton){
        button = 
        <ModalButton ref={buttonRef} exit={() => {console.log("EXIT");setModalButton(false)}} onClick={SavedInstance['modalButton'].callback}
            text={SavedInstance['modalButton'].others.text} styles={SavedInstance['modalButton'].others.styles}
        />
    }

    function showModalButton(callback, text, styles){
        let flag = false;
        if(modalButton) {
            flag = true;
        }
        setModalButton(true);
        SavedInstance['modalButton'].others = {styles, text};
        SavedInstance['modalButton'].callback = callback;
        if(flag) forceUpdate(v => v + 1);
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
            setTipState(true);
        }
    }

    return(
        <div className="App" style={{
            backgroundColor: clientController.getColorSetting(chosenTheme, COLORS.main),
            scrollbarColor: `${clientController.getColorSetting(chosenTheme, COLORS.functional)} ${clientController.getColorSetting(chosenTheme, COLORS.back)}`
        }}>
            <PagePreview text="Trainee-App"/>
            <ProfileBlock openModal = {openModal}/>
            <div className="WideBlock" style={{
                backgroundColor: clientController.getColorSetting(chosenTheme, COLORS.back),
                borderLeft: screen == 'Desktop'?  `2px solid ${clientController.getColorSetting(chosenTheme, COLORS.borderD)}`: '',
                boxShadow: screen == 'Mobile'? clientController.getBoxShadow(chosenTheme): ''
            }}>
                {page}
                {button}
            </div>
            {modalWindow}
            {tip}
        </div>
    )
}

export default App;