import React, { useEffect, useState } from "react";
import './assets/styles/App.css';
import { MainPage } from "./pages/MainPage";
import { ModalWindow, ResultsModal, SettingsModal, SignModal } from "./components/ModalWindow";
import { PagePreview } from "./components/PagePreview";
import { ProfileBlock } from "./components/ProfileBlock";
import { InGamePage } from "./pages/InGamePage";
import clientController, { COLORS } from "./application/ClientController";
import serverController from "./application/ServerController";

const SavedInstance = {
    1: () => {}
};

const App = ({}) => {
    const [pageId, setPage] = useState(0);
    const [modal, setModal] = useState(0);

    const [chosenTheme, setTheme] = useState(clientController.theme);

    useEffect(() => {
        function updateTheme(){
            setTheme(clientController.theme);
        }

        openModal(2, () => {});

        clientController.subscribeOn('theme-switch', updateTheme);
        return () => {
            clientController.unSubscribeOn('theme-switch', updateTheme);
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
        default: modalWindow = null; break;
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
    function moveOutFromGame(results){
        setPage(0);
        openModal(3, () => {serverController.finishGame()}, results);
    }

    return(
        <div className="App" style={{backgroundColor: clientController.getColorSetting(chosenTheme, COLORS.main)}}>
            <PagePreview text="Trainee-App"/>
            <ProfileBlock userName={"Alex"} openModal = {openModal}/>
            {page}
            {modalWindow}
        </div>
    )
}

export default App;