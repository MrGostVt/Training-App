import React, { useCallback, useState } from "react";
import { ModalWindow } from "./ModalWindow";
import { Switch } from "../components/Switch";
import { NewsBlock } from "../components/NewsBlock";
import { InputField } from "../components/InputField";
import clientController, { COLORS } from "../application/ClientController";
import serverController from "../application/ServerController";

export const ProcessNewsModal = ({closeCallback = () => {}}) => {
    const [background, setBackground] = useState(0);
    const [data, setData] = useState({
        title: 'Title',
        description: "Description",
        header: 'Header',
        image: null,
        background: '#7eb0db',
    });
    const [selectedImage, setImage] = useState(null);
    const [isChanged, change] = useState(false);

    const UpdateData = useCallback((property, value) => {
        setData(prev => {
            if(!Object.hasOwn(prev, property)) return prev;
            change(true);
            return {...prev, [property]: value}
        });
    }, [data]);

    return(
        <ModalWindow closeCallback={closeCallback} title="Create" size={2} defaultButton={{isActive: true, type: 'submit', title: 'Create', function: async () => {
            const {header, title, description} = data;
            if(title.length > 3 && header.length > 3 && description.length > 3 && isChanged){
                const responce = await serverController.uploadNews({...data, image: selectedImage}, (status) => {
                    clientController.triggerEvent('show-tip', ['Something went wrong! Try again later.', clientController.getColorSetting(2, 'red')]);
                });
                return responce === true;
            }
            return false;
        }}}>
            <NewsBlock news={[data]}/>
            <Switch title={"Background type"} values={[{val: 0, prev: 'Color'}, {val: 1, prev: 'Image'}]} 
                current={0} callback={setBackground}
            />
            <form className="NewsForm">
                <div className="DefaultFont" style={{
                    backgroundColor: clientController.getColorSettingDefault(COLORS.functionalA),
                    borderColor: clientController.getColorSettingDefault(COLORS.functionalA),
                    borderRadius: '8px',
                    marginBottom: '5%',
                    height: '6vh',
                    position: 'relative', display: 'block'
                }}>
                    <span 
                    style={{
                        position: 'absolute', left: 0, top: 0, width: '100%', height: '100%',
                        display:"flex", alignItems: 'center',
                        marginLeft: '2%', color: clientController.getColorSettingDefault(COLORS.text),
                        fontWeight: '600'
                    }}
                    >Upload an image</span>

                    <input type={background === 0? 'color': 'file'} 
                    defaultValue={background === 0? data.background: null} 
                    accept="image/png, image/jpeg, image/gif"
                    style={{
                        width: '100%', height: '100%',
                        backgroundColor: clientController.getColorSettingDefault(COLORS.functionalA),
                        borderColor: clientController.getColorSettingDefault(COLORS.functionalA),
                        borderRadius: '8px', opacity: background === 0? 1: 0,
                        zIndex: 2, position: 'relative'
                    }}
                    onChange={background === 0?
                        (ev) => {
                            UpdateData('background', ev.target.value);
                        }
                        : (ev) => {
                            const file = ev.target.files[0];
                            if(!file) { clientController.triggerEvent('show-tip', ['Wrong file', clientController.getColorSetting(2, 'red')]); return;}
                            if( file.size > 3 * 1024 * 1024) { clientController.triggerEvent('show-tip', ['File size must be < 3mb', clientController.getColorSetting(2, 'red')]); return;}
                            
                            const isOk = true;
                            
                            if(isOk) {
                                setImage(file); 
                                const url = URL.createObjectURL(file);
                                UpdateData('image',url);
                            }
                        }}
                    />
                </div>
                
                <InputField styles={{width: '100%'}} defaultValue={'Header'}
                onValueChange={(val, state) => {
                    if(state === 2) UpdateData('header', val);
                    else UpdateData('header', null);
                }}/>
                <InputField styles={{width: '100%'}} defaultValue={'Title'}
                min={3} max={60}
                onValueChange={(val, state) => {
                    if(state === 2) UpdateData('title', val);
                    else UpdateData('title', null);
                }}/>
                <InputField styles={{width: '100%'}} defaultValue={'Description'}
                min={3} max={120}
                onValueChange={(val, state) => {
                    if(state === 2) UpdateData('description', val);
                    else UpdateData('description', null);
                }}/>
            </form>
        </ModalWindow>
    )
}