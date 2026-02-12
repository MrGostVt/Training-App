import React, { useEffect, useRef, useState } from "react"
import clientController, { COLORS } from "../application/ClientController";

function validateInput(value, pattern, max, min){
    const dangerousChars = /[<>"'`;{}\[\]\\]/g;
    let isDanger = value.length > max || value.length < min;
    isDanger = isDanger || dangerousChars.test(value);
    isDanger = isDanger || !patterns[pattern].test(value);
    if(isDanger){
        clientController.triggerEvent('show-tip', [`Property must contain only allowed ${min}-${max} symbols`, clientController.getColorSetting(2,'red')]);
    }
    return !isDanger;
};

const patterns = {
    username: /^[a-zA-Z0-9]+$/,
    password: /^[a-zA-Zа-яА-ЯёЁ0-9]+$/, 
    text: /^[a-zA-Zа-яА-ЯёЁ0-9]+$/,
    question: /^[a-zA-Z0-9\?\,\!\.\#_\/\ +\*\%\^\:\=\(\)\-\/\>\<\[\]]+$/,
};

//Добавить экранирование, или перепроверить
export const InputField = ({typeID = 0, defaultValue, clearFunctionRef = {}, handleFunctionRef = {},
    max = 30, min = 1, pattern = 'text', styles, autoComplete = 'off',
    onValueChange = () => {}, contextValidate = async (value, asyncSetDanger) => {return true}}) => {
    const [type, setType] = useState(typeID);
    const [inputState, setInputState] = useState(0);

    const inputRef = useRef(null);
    const lastTimeOutRef = useRef();
    clearFunctionRef.current = clearField;
    handleFunctionRef.current = handleChanges;

    let inputType;
    switch(type){
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
            <input ref={inputRef} className="InputField" id={'InputField' + pattern} type={inputType} required={true} maxLength={max} placeholder={defaultValue} 
            autoComplete={autoComplete} name={pattern}
            style={{
                fontSize: '18px',
                color: clientController.getColorSettingDefault(COLORS.text),
                '--autofill-color': clientController.getColorSettingDefault(COLORS.text),
                '--autofill-background-color':  clientController.getColorSettingDefault(COLORS.functionalA),
                '--autofill-caret-color': clientController.theme === 0? 'black': 'white',
            }}
            onChange={(ev) => {
                clearTimeout(lastTimeOutRef.current);
                console.log('alert', ev.target.value);
                lastTimeOutRef.current = setTimeout(() => {
                    handleChanges(ev.target.value);
                }, 600);
            }}

            ></input>
        </div>
        
    );
}