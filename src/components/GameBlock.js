import React from "react";
import { DefaultButton } from "./DefaultButton";
import "../assets/styles/GameBlock.css"
import { LoadedImages } from "../application/ImageLoad";

export const GameBlock = ({GameInfo = {type: 'undefined', description: 'undefined', typeDescripe: 'undefined', iconUrl: 'undefined'}}) => {
    return(
        <div className="GameBlock">
            <div className="DefaultFont" style={{color: `var(--main-text-dark-color)`, fontSize: '22px', marginBottom: '3%'}}>
                {GameInfo.type}
            </div>
            <div className="InfoInGameBlock">
                <div className="DefaultFont" style={{color: `var(--secondary-text-dark-color)`, fontSize: '14px', width: '60%'}}>
                    {GameInfo.type}
                </div>
                <div className="DefaultFont" style={{color: `var(--main-text-dark-color)`, fontSize: '16px', width: '60%', lineHeight: '30px'}}>
                    {GameInfo.typeDescripe}
                </div>
                <div className="DefaultFont" style={{color: `var(--secondary-text-dark-color)`, fontSize: '14px', width: '60%'}}>
                    {GameInfo.description}
                </div>
                <DefaultButton text="Play" styles={{left: '0%', bottom: '0%', color: `var(--main-text-dark-color)`}}/>
                <InGameIcon iconUrl={GameInfo.iconUrl}/>
            </div>
        </div>
    )
}

const InGameIcon = ({iconUrl}) => (
    <div className="InGameIcon" style={{backgroundImage: `url(${iconUrl})`}}></div>
);