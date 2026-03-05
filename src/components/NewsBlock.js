import React, { useCallback, useEffect, useState } from "react";
import clientController from "../application/ClientController";
import serverController from "../application/ServerController";

const plug = {
    title: 'Nothing happened yet',
    description: "Too calm, isn't it?",
    header: 'silence',
    image: null,
    background: '#7eb0db',
}

export const NewsBlock = ({callPopUp = () => {}, news = undefined}) =>{
    const [chosenTheme, setTheme] = useState(clientController.theme);
    const [screen, setScreen] = useState(clientController.identifyScreenType());
    const [newsList, setNewsList] = useState([plug]);
    const [pointer, setPointer] = useState(0);

    useEffect(() => {
        function updateTheme(){
            setTheme(clientController.theme);
        }
        function handleScreenUpdate(type){
            setScreen(type);
        }
        
        setPointer(0);
        if(news !== undefined && news.length !== 0) setNewsList(news); 

        clientController.subscribeOn('theme-switch', updateTheme);
        clientController.subscribeOn('resize', handleScreenUpdate);

        return () => {
            clientController.unSubscribeOn('theme-switch', updateTheme);
            clientController.unSubscribeOn('resize', handleScreenUpdate);
        }
    }, []);

    useEffect(() => {
        if(news !== undefined && news.length) setNewsList(news);
    }, [news]);
    useEffect(() => {
        if(newsList.length > 1){
            var interval = setInterval(() => {
                MoveRight();
            }, 20000);
        }
        return () => {clearInterval(interval);}
    }, [newsList]);
    
    const MoveRight = useCallback(() => {
        setPointer(p => p + 1 == newsList.length? 0: p + 1);
    });
    return(
        <div className="NewsBlock DefaultFont" style={{
            marginTop: screen == 'Desktop'? '2.5vh': 0,
        }} onClick={() => {
            +serverController.userData.accessLevel === 3? callPopUp(6, () => {}, undefined): null}}>
            <News  {...newsList[pointer]}/>
        </div>
    )
}

const News = ({title, description, header, image, background}) => (
    <div className={"News"} style={{
        backgroundColor: background,
        backgroundImage: image && `url(${image})`,
        top: 0
        }} key={title}>
            <div className={"NewsInfoWrap " + "ProgressBar"}>
                <span className="SmallNewsHeader" style={{
                    borderColor: 'violet', backgroundColor: 'violet'
                }}> {header}</span>
            <div className="NewsTitle">{title}</div>
            <div className="NewsDescription"> {description}</div>
        </div>
    </div>
);