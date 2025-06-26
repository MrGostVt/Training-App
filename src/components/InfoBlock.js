import React from "react";
import clientController, { COLORS } from "../application/ClientController";
import { DefaultButton } from "./DefaultButton";
import '../assets/styles/InfoBlock.css'
import { LoadedImages } from "../application/ImageLoad";

export const InfoBlock = ({title= 'Undefined', text, statistics = [{title: '', score: 0}], icounUrl, button = {title: 'none', function: () => {}}}) => {

    let icon;
    if(!!icounUrl){
        icon = <div className="InfoIcon" style={{backgroundImage: `url(${icounUrl})`}}>
            </div>;
    }

    return(
        <div className="InfoBlock" style={{
            backgroundColor: clientController.getColorSettingDefault(COLORS.functionalA)
        }}>
            <div className="DefaultFont" style={{
                fontWeight: 700,
                textAlign: 'center',
                color: clientController.getColorSettingDefault(COLORS.text),
            }}>{title}</div>
            {icon}
            <div className="DefaultFont InfoText" style={{
                color: clientController.getColorSettingDefault(COLORS.text),
            }}>
               {text}
            </div>
            <div className="DefaultFont InfoStats" style={{
                color: clientController.getColorSettingDefault(COLORS.text),
            }}>
                {statistics.map(val => (
                    <div style={{display: 'flex'}} key={val.title}>
                        <div>{`${val.title}:`}</div>
                        <div style={{
                            marginLeft: '3%',
                            color: clientController.getColorSettingDefault(COLORS.text2),
                        }}>{val.score}</div>
                    </div>
                ))}
            </div>

            <DefaultButton styles={{
                    position: 'absolute',
                    bottom: '5%',
                    left: '5%',
                    width: '90%',
                    backgroundColor: clientController.getColorSettingDefault(COLORS.button),
                    color: clientController.getColorSetting(1, COLORS.text),
            }} text={button.title} onClick={button.function} />
        </div>
    );
}