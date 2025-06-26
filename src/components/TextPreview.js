import React from "react";
import clientController, { COLORS } from "../application/ClientController";

export const TextPreview = ({text, textStyles = {}, wrapStyles = {}}) => {

    return(
        <div className="DefaultFont InputFieldWrap" style={{
            backgroundColor: clientController.getColorSettingDefault(COLORS.functionalA),
            color: clientController.getColorSettingDefault(COLORS.text),
            maxWidth: '100%',
            ...wrapStyles,
        }}>
            <div style={{
                ...textStyles
            }}>
                {text}
            </div>
        </div>
    );
}