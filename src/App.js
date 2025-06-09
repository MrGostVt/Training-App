import React, { useState } from "react";
import './assets/styles/App.css';
import { MainPage } from "./pages/MainPage";
import { ModalWindow, SettingsModal, SignModal } from "./components/ModalWindow";
import { PagePreview } from "./components/PagePreview";
import { ProfileBlock } from "./components/ProfileBlock";
import { InGamePage } from "./pages/InGamePage";

const SavedInstance = {
    1: () => {}
};

const App = ({}) => {
    const [pageId, setPage] = useState(0);
    const [modal, setModal] = useState(0);
    let page;
    switch(pageId){
        case 1: page = <InGamePage />; break;
        case 0: page = <MainPage />; break;
        default: page = null;
    }

    let modalWindow;
    switch(modal){
        case 1: modalWindow = <SettingsModal closeCallback={SavedInstance[1]} />; break;
        case 2: modalWindow = <SignModal />; break;
        default: modalWindow = null; break;
    }

    function openModal(id, callback){
        SavedInstance[id] = () =>{
            setModal(0);
            callback();
        };

        setModal(id);
    }

    return(
        <div className="App">
            <PagePreview text="Trainee-App"/>
            <ProfileBlock userName={"Alex"} openModal = {openModal}/>
            {page}
            {modalWindow}
        </div>
    )
}

export default App;