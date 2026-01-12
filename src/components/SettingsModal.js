import React from "react";
import { useState } from "react";
import clientController, {COLORS} from "../application/ClientController";
import { ModalWindow } from "./ModalWindow";
import { LinkBlock } from "./LinkBlock";
import serverController from "../application/ServerController";
import { Switch } from "./Switch";

export const SettingsModal = ({closeCallback = () => {}}) => {
    const [chosenTheme, setTheme] = useState(clientController.theme);


    return(
        <ModalWindow title="Settings" closeCallback={closeCallback} defaultButton={{isActive: true, title: 'SIGN OUT', function: () => {
            serverController.signOut();
        }}}>
            <Switch title={"Theme"} callback={(val) => {
                setTheme(val);
                clientController.switchTheme();
            }} current={chosenTheme}
            values={[
                {val: 0, prev: 'Light'}, 
                {val: 1, prev: 'Dark'}]}
            />
            <LinkBlock />
        </ModalWindow>
    );
}
