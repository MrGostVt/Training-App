import React, { useEffect, useRef, useState } from "react"
import clientController, { COLORS } from "../application/ClientController";

const inputStypes = {
    fontSize: '18px',
    color: clientController.getColorSettingDefault(COLORS.text),
    '--autofill-color': clientController.getColorSettingDefault(COLORS.text),
    '--autofill-background-color':  clientController.getColorSettingDefault(COLORS.functionalA),
    '--autofill-caret-color': clientController.theme === 0? 'black': 'white',
};

function validateInput(value, pattern, max, min){
    const dangerousChars = /[`;{}\[\]\\]/g;
    let isDanger = value.length > max || value.length < min;
    isDanger = isDanger || dangerousChars.test(value);
    isDanger = isDanger || !patterns[pattern].test(value);
    isDanger = isDanger || value.toLowerCase().split("<script").length > 1; //|| value.toLowerCase().split("drop").length > 1 
    
    if(isDanger){
        clientController.triggerEvent('show-tip', [`Property must contain only allowed ${min}-${max} symbols`, clientController.getColorSetting(2,'red')]);
    }
    return !isDanger;
};

const patterns = {
    username: /^[a-zA-Z0-9]+$/,
    password: /^[a-zA-Zа-яА-ЯёЁ0-9]+$/, 
    text: /^[a-zA-Z0-9\?\,\!\.\#_\/\ +\*\%\^\:\=\(\)\-\/\>\<\[\]\'\"]+$/,
    question: /^[a-zA-Z0-9\?\,\!\.\#_\/\ +\*\%\^\:\=\(\)\-\/\>\<\[\]]+$/,
    longText: /^[a-zA-Z0-9\?\,\!\.\#_\/\ +\*\%\^\:\=\(\)\-\/\>\<\[\]\'\|\"]+$/,
};

//Добавить экранирование, или перепроверить
export const InputField = ({typeID = 0, defaultValue, clearFunctionRef = {}, handleFunctionRef = {},
    max = 30, min = 1, pattern = 'text', styles, autoComplete = 'off', isBigText = false,
    onValueChange = () => {}, contextValidate = async (value, asyncSetDanger) => {return true}}) => {
    const [type, setType] = useState(typeID);
    const [isTextArea] = useState(isBigText);
    const [inputState, setInputState] = useState(0);

    const inputRef = useRef(null);
    const lastTimeOutRef = useRef();
    clearFunctionRef.current = clearField;
    handleFunctionRef.current = handleChanges;

    let inputType;
    switch(type){
        case 2: inputType = 'number'; break;
        case 1: inputType = 'password'; break;
        default: inputType = 'text'; break;
    }

    async function handleChanges(value){
        if(inputState != 0){
            setInputState(0);
            if(value.length === 0){
                return;
            }
        }
        const isSafe = validateInput(value, pattern, max, min) && await contextValidate(value, (onEnd = () => {}) => {
            setInputState(1);
            onValueChange(value,1);
            onEnd();
            return;
        });

        if(!isSafe){
            setInputState(1);
            onValueChange(value, 1);
            return;
        }

        setInputState(2);
        onValueChange(value, 2);
    }
    function clearField(){
        setInputState(0);
        inputRef.current.value = ""
    }

    let stateDisplay;
    switch(inputState){
        case 2: stateDisplay = 'drop-shadow(0px 4px 0px rgb(9, 255, 0))'; break;
        case 1: stateDisplay = 'drop-shadow(0px 4px 0px rgb(255, 0, 0))'; break;
        default: stateDisplay = ''; break;
    }

    return(
        <div className="InputFieldWrap DefaultFont" style={{
            backgroundColor: clientController.getColorSettingDefault(COLORS.functionalA),
            filter: stateDisplay,
            ...styles
        }}>
            {
                !isTextArea?
                <input ref={inputRef} className="InputField" id={'InputField' + pattern} type={inputType} required={true} maxLength={max} placeholder={defaultValue} 
                autoComplete={autoComplete} name={pattern}
                style={inputStypes}
                onChange={(ev) => {
                    clearTimeout(lastTimeOutRef.current);
                    lastTimeOutRef.current = setTimeout(() => {
                        handleChanges(ev.target.value);
                    }, 600);
                }}

                ></input>
                :
                <textarea style={inputStypes} className="InputField" ref={inputRef}
                id={'InputField' + pattern} type={inputType} required={true} maxLength={max} placeholder={defaultValue}
                autoComplete={autoComplete} name={pattern}
                onChange={(ev) => {
                    clearTimeout(lastTimeOutRef.current);
                    lastTimeOutRef.current = setTimeout(() => {
                        handleChanges(ev.target.value.replace(/\r?\n|\r/g, ""));
                    }, 600);

                    const textarea = inputRef.current;
                    textarea.style.height = "auto";
                    textarea.style.height = textarea.scrollHeight + "px"; 
                }}
                >
                </textarea>
            }
        </div>
        
    );
}