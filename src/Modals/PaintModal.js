import React, {  useEffect, useRef, useState } from "react";
import { ModalWindow } from "./ModalWindow";
import { PaintDesk } from "../components/PaintDesk";
import { Switch } from "../components/Switch";
import clientController, {COLORS} from "../application/ClientController";
import { TextPreview } from "../components/TextPreview"

//Select numbers in the range 16 * 10 / 5 - 56 / 8 * 6
export const PaintModal = ({closeCallback = () => {}, tiptext = ''}) => {
    const [brushSize, setBrushSize] = useState(5);
    const [brushColor, setBrushColor] = useState(clientController.getColorSetting(2, 'black'));
    const [title, setTitle] = useState(tiptext);

    return (
        <ModalWindow title="Solve!" closeCallback={closeCallback} size={2}>
            <Switch title={'Brush size'} current={2} values={[{val: 10, prev: 10}, {val: 15, prev: 15}, {val: 5, prev: 5}]}
            callback={(val) => {setBrushSize(val);}}/>
            <Switch title={'Brush color'} values={[
                {val: clientController.getColorSetting(2, 'black'), prev: '', buttonStyles: {backgroundColor: clientController.getColorSetting(2, 'black')}}, 
                {val: clientController.getColorSetting(2, 'red'), prev: '', buttonStyles: {backgroundColor: clientController.getColorSetting(2, 'red')}}, 
                {val: clientController.getColorSetting(2, 'yellow'), prev: '', buttonStyles: {backgroundColor: clientController.getColorSetting(2, 'yellow')}},
                {val: clientController.getColorSetting(2, 'green'), prev: '', buttonStyles: {backgroundColor: clientController.getColorSetting(2, 'green')}},
                {val: clientController.getColorSettingDefault(COLORS['functionalA']), prev: 'Eraser'}
                ]}
                callback={(val) => {setBrushColor(val);}}/>
            <PaintDesk brushColor={brushColor} brushSize={brushSize}/>
            <TextPreview text={title} 
            wrapStyles={{
                position: 'absolute', bottom: '0%', left: '5%', right: '5%', width: 'auto', 
                backgroundColor: clientController.getColorSettingDefault(COLORS.main),
            }}
            textStyles={{display: 'flex', flexDirection: 'row', justifyContent: 'center', textAlign: 'center'}}
            />

        </ModalWindow>
    )
}
