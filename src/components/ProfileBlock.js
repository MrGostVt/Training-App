import React from "react";
import { useState } from "react";
import { UserIcon, UserInfo } from "./User";

export const ProfileBlock = ({userName, infoToDisplay}) => {
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
        </div>
    );
}