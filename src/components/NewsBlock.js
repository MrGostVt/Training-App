import React, { useEffect, useState } from "react";
import clientController from "../application/ClientController";

const plug = {
    title: 'Nothing happened yet',
    description: "Too calm, isn't it?",
    header: 'silence',
    image: null,
    background: '#7eb0db',
}
// setNewsList([
        //     {
        //         title: 'First information',
        //         description: 'Legend of football dancing in the moonlight',
        //         header: 'Thats too cold.',
        //         image: null,
        //         background: '#7eb0db',
        //     },
        //     {
        //         title: 'Second information',
        //         description: 'Legend of football dancing in the sunlight',
        //         header: 'Thats too hot.',
        //         image: null,
        //         background: '#7edb91',
        //     },
        //     {
        //         title: 'Third information',
        //         description: 'Legend of football dancing in the rainlight',
        //         header: 'Thats too good.',
        //         image: null,
        //         background: '#db7e7e',
        //     },
        // ]);

export const NewsBlock = ({}) =>{
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

        

        clientController.subscribeOn('theme-switch', updateTheme);
        clientController.subscribeOn('resize', handleScreenUpdate);

        return () => {
            clientController.unSubscribeOn('theme-switch', updateTheme);
            clientController.unSubscribeOn('resize', handleScreenUpdate);
        }
    }, []);

    useEffect(() => {
        if(newsList.length > 1){
            var interval = setInterval(() => {
                MoveRight();
            }, 20000);
        }
        return () => {clearInterval(interval);}
    }, [newsList]);
    
    function MoveRight(){
        setPointer(p => p + 1 == newsList.length? 0: p + 1);
    }
    
    return(
        <div className="NewsBlock DefaultFont" style={{
            marginTop: screen == 'Desktop'? '2.5vh': 0,
        }}>
            <News  {...newsList[pointer]}/>
        </div>
    )
}

const News = ({title, description, header, image, background}) => (
    <div className={"News"} style={{
        backgroundColor: background,
        top: 0
        }} key={title}>
            <div className={"NewsInfoWrap " + "ProgressBar"}>
                <h className="SmallNewsHeader" style={{
                    borderColor: 'violet', backgroundColor: 'violet'
                }}> {header}</h>
            <div className="NewsTitle">{title}</div>
            <div className="NewsDescription"> {description}</div>
        </div>
    </div>
);