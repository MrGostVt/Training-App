import React, { useEffect, useState } from "react";
import '../assets/styles/User.css'
import { LoadedImages } from "../application/ImageLoad";
import clientController, { COLORS } from "../application/ClientController";

export const UserIcon = ({userIconUrl}) => {
    
    return(
        <div className="UserIconDefault" 
        style={{backgroundImage: `url(${userIconUrl? userIconUrl: LoadedImages['UndefinedUser.png']})`}}>
        </div>
    );
}

export const UserInfo = ({info, theme}) => {
    const [chosenTheme, setTheme] = useState(theme);

    useEffect(() => {
        setTheme(theme);
    }, [theme]);
    const name = info.name || 'undefined';
    const other = info.other || [];

    return(
        <div className="UserInfoDefault">
            <div className="DefaultFont" style={{fontSize: '22px', color: clientController.getColorSetting(chosenTheme, COLORS.text)}}>{name}</div>
            {other.map(val => (
                <div className="DefaultFont" style={{fontSize: '16px', color: clientController.getColorSetting(chosenTheme, COLORS.text2)}} key={val}>{val}</div>
            ))}
        </div>
    )
}