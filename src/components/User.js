import React from "react";
import '../assets/styles/User.css'
import { LoadedImages } from "../application/ImageLoad";

export const UserIcon = ({userIconUrl}) => {
    
    return(
        <div className="UserIconDefault" 
        style={{backgroundImage: `url(${userIconUrl? userIconUrl: LoadedImages['UndefinedUser.png']})`}}>
        </div>
    );
}

export const UserInfo = ({info}) => {
    const name = info.name || 'undefined';
    const other = info.other || [];

    return(
        <div className="UserInfoDefault">
            <div className="DefaultFont" style={{fontSize: '22px', color: `var(${'--main-text-dark-color'})`}}>{name}</div>
            {other.map(val => (
                <div className="DefaultFont" style={{fontSize: '16px', color: `var(${'--secondary-text-dark-color'})`}} key={val}>{val}</div>
            ))}
        </div>
    )
}