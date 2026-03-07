import React from "react";
import { useState } from "react";
import clientController, {COLORS} from "../application/ClientController";
import { ModalWindow } from "./ModalWindow";

export const ResultsModal = ({type, screen, results, closeCallback = () => {}}) => {
    
    return(
        <ModalWindow title={type} closeCallback={closeCallback} 
        size={screen === 'Mobile'?3:0}
        defaultButton={{isActive: true, title: 'Claim',
        function: () => {
            return true
        }}}>
            <ResultsDisplay results={results} screen={screen}/>
        </ModalWindow>
    );
}

//results = [[points, maxPoints]]
const ResultsDisplay = ({results = [], screen}) => {
    
    return(
        <div className="ResultsDisplay">
            {results.map((val, i) => (
                <div className="ResultWrap" style={{
                    backgroundColor: clientController.getColorSettingDefault( COLORS.functionalA),
                    color: clientController.getColorSettingDefault( COLORS.text),
                    width: screen === 'Desktop'? '47%': '95%',
                    }} key={i}>
                    <div className="DefaultFont" style={{
                        marginLeft: '5px', 
                        alignSelf: 'center',
                        width: '70%'
                    }}>{` Question №${i+1}:`}</div>
                    <div className="DefaultFont" style={{
                        position: 'relative',
                        flex:1,
                        textAlign: 'center',
                        backgroundColor: val[0] === val[1]? 'yellowgreen': val[0] !== 0? 'orange': '#cb0000',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                    }}>{` ${val[0]}/${val[1]}`}</div>
                </div>
            ))}
        </div>
    );
}
