import React, { useRef, useState } from "react"
import clientController, { COLORS } from "../application/ClientController";

function validateInput(value, pattern, max, min){
    const dangerousChars = /[<>"'`;{}\[\]\\]/g;
    let isDanger = value.length > max || value.length < min;
    isDanger = isDanger || dangerousChars.test(value);
    isDanger = isDanger || !patterns[pattern].test(value);
    return isDanger;
}

const patterns = {
    login: /^[a-zA-Z0-9]+$/,
    password: /^[a-zA-Zа-яА-ЯёЁ0-9]+$/, 
    text: /^[a-zA-Zа-яА-ЯёЁ0-9]+$/,
    question: /^[a-zA-Z0-9\?\,\!\.\#_ \+\*\%\^\:\=\(\)\-]+$/,
}

export const InputField = ({typeID = 0, defaultValue, clearFunctionRef = {},
    max = 30, min = 1, pattern = 'text', styles,
    onValueChange = () => {}}) => {
    const [type, setType] = useState(typeID);
    const [inputState, setInputState] = useState(0);
    const [value, setValue] = useState('');
    const lastTimeOutRef = useRef();
    clearFunctionRef.current = clearField;

    let inputType;
    switch(type){
        case 1: inputType = 'password'; break;
        default: inputType = 'text'; break;
    }

    function handleChanges(value){
        if(inputState != 0){
            setInputState(0);
        }
        const isDangerous = validateInput(value, pattern, max, min);

        // console.log(isDangerous);
        if(isDangerous){
            setInputState(1);
            onValueChange(value, 1);
            return;
        }

        setInputState(2);
        onValueChange(value, 2);
    }
    function clearField(){
        setValue('');
    }

    let stateDisplay;
    switch(inputState){
        case 2: stateDisplay = 'drop-shadow(0px 4px 0px rgb(9, 255, 0))'; break;
        case 1: stateDisplay = 'drop-shadow(0px 4px 0px rgb(255, 0, 0))'; break;
    }

    return(
        <div className="InputFieldWrap DefaultFont" style={{
            backgroundColor: clientController.getColorSettingDefault(COLORS.functionalA),
            filter: stateDisplay,
            ...styles
        }}>
            <input className="InputField" type={inputType} required={true} maxLength={max} placeholder={defaultValue}
            value={value}
            style={{
                fontSize: '18px',
                color: clientController.getColorSettingDefault(COLORS.text),
            }}
            onChange={(ev) => {
                setValue(ev.target.value);
                clearTimeout(lastTimeOutRef.current);
                lastTimeOutRef.current = setTimeout(() => {
                    handleChanges(ev.target.value);
                }, 300);
            }}
            ></input>
        </div>
        
    );
}