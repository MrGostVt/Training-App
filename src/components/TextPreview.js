import React, { useEffect, useState } from "react";
import clientController, { COLORS } from "../application/ClientController";

export const TextPreview = ({text, textStyles = {}, wrapStyles = {}, highlightMath = false, hightlightColor = ''}) => {
    const [editedText, updateText] = useState([text]);
    
    useEffect(() => {
        if (!highlightMath) return;
      
        const result = [];
        let buffer = "";
        let isMath = /[0-9\-+/*^]/.test(text[0]);
        for (let char of text) {
            const charIsMath = /[0-9\-+/*^]/.test(char);
            if(charIsMath === isMath || char === ' '){
                buffer += char;
            }
            else{
                result.push({text:buffer, math: isMath});
                buffer = char;
                isMath = charIsMath;
            }
        }
      
        if (buffer) {
          result.push({ text: buffer, math: isMath });
        }
      
        updateText(
          result.map((part, i) =>
            <span key={i} style={{ 
                color: part.math ? hightlightColor: "inherit", marginRight: '6px' 
                }}>
              {part.text}
            </span>
          )
        );
      }, [text]);

    return(
        <div className="DefaultFont InputFieldWrap" style={{
            backgroundColor: clientController.getColorSettingDefault(COLORS.functionalA),
            color: clientController.getColorSettingDefault(COLORS.text),
            maxWidth: '100%',
            ...wrapStyles,
        }}>
            <div style={{
                ...textStyles,
                display: 'inline'
            }}>
                {editedText.map(val => (
                    val
                ))}
                {/* {text} */}
            </div>
        </div>
    );
}