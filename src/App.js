import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import { ProcessNewsModal } from "./Modals/ProcessNewsModal";
import { ProcessThemeModal } from "./Modals/ProcessThemeModal";
import { ExceptionModal } from "./Modals/ExceptionModal";
import { LoadingPage } from "./pages/LoadingPage";

const SavedInstance = {
    'tip': {callback: () => {}, others: {
        text: '', styles: undefined
    }, queue: []},
    'modalButton': {callback: () => {}, others: {
        text: '', color: undefined
    }},
};

const App = ({}) => {
    const [loading, setLoading] = useState(true);
    const [lightLoading, setLightLoading] = useState(false);
    const [pageId, setPage] = useState(0);
    const [modal, setModal] = useState(0);
    const [tipState, setTipState] = useState(false);
    const [screen, setScreen] = useState(clientController.identifyScreenType());
    const [chosenTheme, setTheme] = useState(clientController.theme);
    const [modalButton, setModalButton] = useState(false);
    const [,forceUpdate] = useState(0);

    const [modalData, setModalData] = useState({callback: null, others: null});


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
        function onDoesntWork(){
            openModal(8, () => {})
        }
        function onLoadingDone(){
            setLoading(false);
        }

        clientController.subscribeOn('theme-switch', updateTheme);
        clientController.subscribeOn('unauthorized', onUnauthorized );
        clientController.subscribeOn('forbidden', onForbidden);
        clientController.subscribeOn('show-tip', showTip); 
        clientController.subscribeOn('resize', handleResize);
        clientController.subscribeOn('doesnt-work', onDoesntWork);
        clientController.subscribeOn('loading-complete', onLoadingDone);

        serverController.init();

        return () => {
            clientController.unSubscribeOn('theme-switch', updateTheme);
            clientController.unSubscribeOn('unauthorized', onUnauthorized);
            clientController.unSubscribeOn('forbidden', onForbidden);
            clientController.unSubscribeOn('show-tip', showTip);
            clientController.unSubscribeOn('resize', handleResize);
            clientController.unSubscribeOn('doesnt-work', onDoesntWork);
            clientController.unSubscribeOn('onLoadingDone', onLoadingDone);
        }
    }, []);

    const buttonRef = useRef();
    const page = (() => {
        switch(pageId){
            case 1: return <InGamePage moveOut = {moveOutFromGame} setLoading={setLightLoading}/>;
            case 0: 
                return <MainPage screen={screen} callPopUp={openModal} moveToGame={moveToGame} 
                setLoading={setLightLoading} callButton={showModalButton} 
                moveButtonAway={() => buttonRef.current.close()}
                />;
            default: return null;
        }
    })();


    const modalWindow = useMemo(() => {
        switch(modal){
            case 1: return <SettingsModal closeCallback={modalData.callback} />;
            case 2: return <SignModal closeCallback={modalData.callback}/>;
            case 3: return <ResultsModal screen={screen} type="Practice" results={modalData.others} closeCallback={modalData.callback}/>;
            case 4: return <ProcessQuestionsModal closeCallback={modalData.callback} />;
            case 5: return <PaintModal closeCallback={modalData.callback} tiptext={modalData.others}/>;
            case 6: return <ProcessNewsModal closeCallback={modalData.callback} />;
            case 7: return <ProcessThemeModal closeCallback={modalData.callback} />;
            case 8: return <ExceptionModal closeCallback={modalData.callback} />;
            default: return null;
        }
    }, [modal, modalData,screen]);

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
        setModalData({
            callback: () => {
                setModal(0);
                if(callback !== null) callback();
            },
            others
        });

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
    
    if(loading){
        return(
            <div className="App" style={{
                backgroundColor: clientController.getColorSetting(chosenTheme, COLORS.main),
                scrollbarColor: `${clientController.getColorSetting(chosenTheme, COLORS.functional)} ${clientController.getColorSetting(chosenTheme, COLORS.back)}`
            }}>
                <LoadingPage />
                {modalWindow}
                {tip}
            </div>
        );
    }

    let lightLoadingComponent;
    if(lightLoading){
        lightLoadingComponent = <LoadingPage />
    }

    return(
        <div className="App" style={{
            backgroundColor: clientController.getColorSetting(chosenTheme, COLORS.main),
            scrollbarColor: `${clientController.getColorSetting(chosenTheme, COLORS.functional)} ${clientController.getColorSetting(chosenTheme, COLORS.back)}`
        }}>
            {lightLoadingComponent}
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