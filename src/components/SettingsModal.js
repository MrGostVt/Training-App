import React from "react";
import { useState } from "react";
import clientController, {COLORS} from "../application/ClientController";
import { ModalWindow } from "./ModalWindow";
import { LinkBlock } from "./LinkBlock";
import serverController from "../application/ServerController";

const ThemeSwitch = ({}) => {
    const [chosenTheme, setTheme] = useState(clientController.theme);
    const text = !!chosenTheme? 'Dark': 'Light'

    return(
        <div className="ThemeSwitch DefaultFont" onClick={() => {
            setTheme(!!chosenTheme? 0: 1);
            clientController.switchTheme();
        }} style={{fontSize: '20px', color: clientController.getColorSetting(chosenTheme, COLORS.text)}}>
            Theme
            <div className="ThemeButton" 
            style={{backgroundColor: clientController.getColorSetting(chosenTheme, COLORS.functionalA)}}>
                {text}
            </div>
        </div>
    )
};

export const SettingsModal = ({closeCallback = () => {}}) => {

    return(
        <ModalWindow title="Settings" closeCallback={closeCallback} defaultButton={{isActive: true, title: 'SIGN OUT', function: () => {
            serverController.signOut();
        }}}>
            <ThemeSwitch />
            <LinkBlock />
        </ModalWindow>
    );
}
