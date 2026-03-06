import React, { useEffect, useState } from "react";
import '../assets/styles/User.css'
import { LoadedImages } from "../application/ImageLoad";
import clientController, { COLORS } from "../application/ClientController";
import CameraIcon from "../assets/icons/camera.svg";
import serverController from "../application/ServerController";
import { UsePreviousState } from "./customHooks/UsePreviousState";


export const UserIcon = ({userIconUrl}) => {
    const [splash, setSplash] = useState(false);
    const [icon, setIcon] = useState(userIconUrl);
    const [previousIcon, setPrevious] = UsePreviousState(icon);

    const HandleUpload = async (ev) => {
        const file = ev.target.files[0];
        if(!file) { clientController.triggerEvent('show-tip', ['Wrong file', clientController.getColorSetting(2, 'red')]); return;}
        if( file.size > 3 * 1024 * 1024) { clientController.triggerEvent('show-tip', ['File size must be < 3mb', clientController.getColorSetting(2, 'red')]); return;}
        
        const isOk = await serverController.uploadIcon(file, (status) => {
            clientController.triggerEvent('show-tip', [status == 429? 'Too many attempts. \n Try again later': 'Something went wrong! \n Try again later', clientController.getColorSetting(2, 'red')])
            setIcon(previousIcon);
        });
        
        if(isOk) {
            const url = URL.createObjectURL(file);
            setIcon(url);
        }
    }
    useEffect(() => {
        if(icon != null && icon.split(serverController.getApi()).length > 1){
            const img = new Image();
            img.src = icon;
            img.onerror = () => {
                console.log(icon);
                setIcon(null);
            }
        }
    }, [icon]);
    
    return(
        <div className="UserIconDefault" onMouseEnter={() => {setSplash(true)}} onMouseLeave={() => {setSplash(false)}} >
            <div className="IconImage"  style={{backgroundImage: `url(${icon? icon: LoadedImages['UndefinedUser.png']})`}} 
            onError={() => {console.log("ALEKESY")}}></div>
            <div className="IconSplash" style={{bottom: splash? '0%': '-30%'}}>
                <CameraIcon style={{
                    fill: clientController.getColorSetting(1,COLORS.text),
                    position: 'relative',
                }} 
                    width={25} height={25}/>
            </div>
            <input style={{position: 'absolute', width: '100%', height: '100%', 
                top: 0, opacity: 0}} 
                type="file" name="avatar" onChange={HandleUpload}
                accept="image/png, image/jpeg, image/gif"
            />
        </div>
    );
}

export const UserInfo = ({info, theme}) => {
    const [chosenTheme, setTheme] = useState(theme);

    useEffect(() => {
        setTheme(theme);
    }, [theme]);
    const name = info.name || 'undefined';
    const other = info.other || [];

    return(
        <div className="UserInfoDefault">
            <div className="DefaultFont" style={{fontSize: '22px', fontWeight: 600, color: clientController.getColorSetting(chosenTheme, COLORS.text)}}>{name}</div>
            {other.map((val,i) => (
                <div key={`${val.text}-${i}`}className="DefaultFont" style={{fontSize: '16px', color: clientController.getColorSetting(chosenTheme, COLORS.text2), ...val.styles}}>{val.text}</div>
            ))}
        </div>
    )
}