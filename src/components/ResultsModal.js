import React from "react";
import { useState } from "react";
import clientController, {COLORS} from "../application/ClientController";
import { ModalWindow } from "./ModalWindow";

export const ResultsModal = ({type, results, closeCallback = () => {}}) => {
    
    return(
        <ModalWindow title={type} closeCallback={closeCallback} defaultButton={{isActive: true, title: 'Claim', function: () => {return true}}}>
            <ResultsDisplay results={results} />
        </ModalWindow>
    );
}

//results = [[points, maxPoints]]
const ResultsDisplay = ({results = []}) => {
    
    return(
        <div className="ResultsDisplay">
            {results.map((val, i) => (
                <div className="ResultWrap" style={{
                    backgroundColor: clientController.getColorSettingDefault( COLORS.functionalA),
                    color: clientController.getColorSettingDefault( COLORS.text)
                    }} key={i}>
                    <div className="DefaultFont" style={{marginLeft: '5px'}}>{` Question №${i+1}:`}</div>
                    <div className="DefaultFont" style={{
                        position: 'relative',
                        width: '50px',
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
