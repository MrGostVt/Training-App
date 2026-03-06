import React from "react";
import KnowledgeIcon from "../assets/icons/knowledge.svg"
import clientController, { COLORS } from "../application/ClientController";

export const LoadingPage = () => {

    return(
        <div className="LoadingPage DefaultFont" style={{
            backgroundColor: clientController.getColorSettingDefault(COLORS.main),
            '--IconStroke': clientController.getColorSettingDefault(COLORS.button),
            '--IconBack': clientController.getColorSettingDefault(COLORS.functional),
        }}>
            <KnowledgeIcon />
            <h1 style={{fontSize: '30px', fontWeight: 'bolder', color: clientController.getColorSettingDefault(COLORS.text)}}>
                Training-App
            </h1>
            <LoadingSpinner />
            <h2 style={{fontSize: '15px', fontWeight: 'bold', color: clientController.getColorSettingDefault(COLORS.text)}}>
                Loading
            </h2>
        </div>
    )
}

const LoadingSpinner = ({}) => {
    return(
        <div className="LoadingSpinner"></div>
    );
}