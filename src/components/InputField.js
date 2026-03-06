import React, { useEffect, useRef, useState } from "react"
import clientController, { COLORS } from "../application/ClientController";
import { DefaultButton } from "./DefaultButton";

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
    longText: /^[a-zA-Z0-9\?\,\!\.\#_\/\ +\*\%\^\:\=\(\)\-\/\>\<\[\]\'\|\@\"]+$/,
    number: /^[0-9]+$/,
    'confirm_password': /^[a-zA-Zа-яА-ЯёЁ0-9]+$/,
};

//Добавить экранирование, или перепроверить
export const InputField = ({typeID = 0, ref={}, defaultValue, clearFunctionRef = {}, handleFunctionRef = {},
    max = 30, min = 1, pattern = 'text', styles, autoComplete = 'off', isBigText = false,
    hideButton = false,
    onValueChange = () => {}, contextValidate = async (value, asyncSetDanger) => {return true}}) => {
    const [type, setType] = useState(typeID);
    const [isTextArea] = useState(isBigText);
    const [inputState, setInputState] = useState(0);

    const inputRef = useRef(null);
    const lastTimeOutRef = useRef();
    clearFunctionRef.current = clearField;
    handleFunctionRef.current = handleChanges;

    let inputType;
    let showButton = null;
    if(hideButton){
        showButton = <DefaultButton text={type === 1? "👁️" : "🙈"} 
        styles={{right: '2%', width: '7.5%', height: '60%', top: '20%'}}
        onClick={(ev) => {
            ev.preventDefault();
            setType(prev => prev === 1? 0: 1);
        }}
        />; 
    }
    switch(type){
        case 2: inputType = 'number'; break;
        case 1: inputType = 'password'; break;
        default: inputType = 'text'; break;
    }

    const setRefs = (node) => {
        inputRef.current = node;
        ref.current = node;
    }

    async function handleChanges(value){
        if(value.length === 0){
            onValueChange(value, min===0?2:1);
            setInputState(0);
            return;
        }
        console.log(inputState);
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
                <input ref={setRefs} className="InputField" id={'InputField' + pattern} type={inputType} required={true} maxLength={max} placeholder={defaultValue} 
                autoComplete={autoComplete} name={pattern}
                style={inputStypes}
                onChange={(ev) => {
                    console.log('CHANGE!')

                    clearTimeout(lastTimeOutRef.current);
                    lastTimeOutRef.current = setTimeout(() => {
                        handleChanges(ev.target.value);
                    }, 600);
                }}

                ></input>
                
                :
                <textarea ref={setRefs} style={inputStypes} className="InputField"
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
            {showButton}
        </div>
        
    );
}