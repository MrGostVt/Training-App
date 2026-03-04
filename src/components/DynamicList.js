import React, { useCallback, useEffect, useRef, useState } from "react";
import { DefaultButton } from "../components/DefaultButton";
import PlusIcon from "../assets/icons/Plus.svg"
import { Switch } from "../components/Switch";
import { InputField } from "../components/InputField";
import clientController, { COLORS } from "../application/ClientController";
import serverController from "../application/ServerController";
import { TextPreview } from "../components/TextPreview";


export const DynamicList = ({ref, defaultValue = '', min=0, max=25, verify = () => true, onUpdate = () => {}}) => {
    const [list, setList] = useState([]);
    const [entry, setEntry] = useState(null);
    const clearRef = useRef(undefined);

    return(
        <div>
            {
                list.map(val => (
                    <div style={{
                        display: 'flex',
                        position: 'relative',
                        marginBottom: '5%',
                        left: '5%', 
                        width: '90%',
                    }}>
                        <TextPreview text={val} key={val} wrapStyles={{width: '80%', marginBottom: '0%'}}/>
                        <DefaultButton text={<PlusIcon className={'XIcon'}/>} onClick={(ev) => {
                            ev.preventDefault();
                            const params = list.filter((entry) => entry !== val);

                            setList(params);
                            onUpdate(params);
                        }}
                        styles={{
                            height: '5.5vh',
                            width: '5.5vh',
                            margin: '0 auto',
                            position: 'relative',
                            backgroundColor: clientController.getColorSettingDefault(COLORS.functionalA),
                        }}/>
                    </div>

                ))
            }
            <div style={{
                    display: 'flex',
                    position: 'relative',
                    marginBottom: '5%',
                    left: '5%', 
                    width: '90%',
                }}>
                <InputField defaultValue={defaultValue} max={max} min={min} onValueChange={(val, status) => {
                    if(status === 2) setEntry(val);
                    else setEntry(null);
                }}  clearFunctionRef={clearRef} contextValidate={(val, asynSetDanger) => verify(val, asynSetDanger)}
                    pattern="question" styles={{width: '80%', marginBottom: '1%'}} />
                <DefaultButton text={<PlusIcon />} onClick={(ev) => {
                    ev.preventDefault();
                    if(entry === null) return;

                    const array = [...list, entry]; 
                    setEntry(null);
                    setList(array);
                    clearRef.current();
                    onUpdate(array);
                    // scrollRef.current && scrollRef.current.scroll({behavior: "smooth"});
                }}
                    styles={{
                        height: '5.5vh',
                        width: '5.5vh',
                        margin: '0 auto',
                        position: 'relative',
                        backgroundColor: clientController.getColorSettingDefault(COLORS.functionalA),
                    }}>
                </DefaultButton>
                <div ref={ref}></div>
            </div>
        </div>
    );
}