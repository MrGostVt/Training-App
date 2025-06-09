import React from "react";
import { useState } from "react";
import { UserIcon, UserInfo } from "./User";
import { LoadedImages } from "../application/ImageLoad";

export const ProfileBlock = ({userName, infoToDisplay, openModal = () => {}}) => {
    const [cardState, setCardState] = useState(0);

    return(
        <div style={
            {
                left: '5%', 
                width: '90%', 
                position: 'relative', 
                height: '17vh',
                display: '-webkit-inline-box',
                marginBottom: '5%',
            }}>
            <UserIcon />
            <UserInfo info={
                {
                    name: userName,
                    other: [`Level ${1}`],
                }
            } />

            <SettingsButton onClick={openModal} />
        </div>
    );
}

const SettingsButton = ({onClick = () => {}}) => {
    const [animState, setAnimState] = useState(0);

    let anim;
    switch(animState){
        case 2: anim = 'SettingsClose'; break;
        case 1: anim = 'SettingsOpen'; break;
        default: anim = ''; break;
    }

    return(
        <div className={`SquareButton ${anim}`} style={{
            backgroundImage: `url(${LoadedImages['Settings.svg']})`,
            right: '0%'
        }}
        onClick={() => {
            onClick(1, () => {
                setAnimState(2);
            });
            setAnimState(1);
        }}></div>
    );
}