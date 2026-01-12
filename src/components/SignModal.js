import React, {  useRef, useState } from "react";
import { ModalWindow } from "./ModalWindow";
import { InputField } from "./InputField";
import clientController from "../application/ClientController";
import { COLORS } from "../application/ClientController";
import serverController from "../application/ServerController";

const messageStyles = {
    position: 'absolute',
    left: '5%',
    bottom: '28%',
    width: '90%',
    textAlign: 'center',
};

export const SignModal = ({closeCallback = () => {}}) => {
    const [signType, setSignType] = useState(0);
    const [passInfo, setPassInfo] = useState({
        pass: '',
        state: false,
    });
    const [logInfo, setLogInfo] = useState({
        log: '',
        state: false,
    });
    const passwordHandlerRef = useRef(() => {});
    const loginHandlerRef = useRef(() => {});

    let signMessage = <div className="DefaultFont" style={{...messageStyles, color: clientController.getColorSettingDefault(COLORS.text)}} onClick={() => {
        setSignType(0);
        setTimeout(() => {
            if(passInfo.pass.length !== 0){ passwordHandlerRef.current(passInfo.pass); }
            if(logInfo.log.length !== 0){ loginHandlerRef.current(logInfo.log); }
        }, 50);
    }}>New user? Sign Up</div>;
    if(signType === 0){
        signMessage = <div className="DefaultFont" style={{...messageStyles, color: clientController.getColorSettingDefault(COLORS.text)}} onClick={() => {
            setSignType(1);
            setTimeout(() => {
                if(passInfo.pass.length !== 0){ passwordHandlerRef.current(passInfo.pass); }
                if(logInfo.log.length !== 0){ loginHandlerRef.current(logInfo.log); }
            }, 50);

        }}>Already have an account? Sign In</div>
    }

    function onPassChange(val, state){
        setPassInfo({
            pass: val,
            state: state === 2,
        });     
    }
    function onLogChange(val, state){
        // serverController.isLoginExist(val);
        setLogInfo({
            log: val,
            state: state === 2
        });
    }
    return(
        <ModalWindow title={signType === 1? 'Sign In': 'Sign Up'} closeCallback={closeCallback} isBackgroundClose={false}
        defaultButton={{isActive: true, title:signType === 1? 'SIGN IN': 'SIGN UP', type:'submit', function: async () => {
                // await serverController.loading(1500)
                // return passInfo.state && logInfo.state;
                if(passInfo.state && logInfo.state){
                    if(signType === 1){
                        const isOk = await serverController.logIn(logInfo.log, passInfo.pass);
                        return isOk;
                    }
                    
                    const isOk = await serverController.register(logInfo.log, passInfo.pass);
                    return isOk;
                }
                return false;
            }}}>
            <form className="SignWrap" autoComplete="on" method="post">
                <InputField typeID = {0} defaultValue={'Username'} pattern="username" max={50} min={3} autoComplete={"username"}
                handleFunctionRef={loginHandlerRef}
                onValueChange={onLogChange} contextValidate={async (value, asyncSetDanger) => {
                    if(signType === 1){
                        function onResult(){
                            asyncSetDanger(() => {clientController.unSubscribeOn('wron-data', onResult);})
                        }
                        clientController.subscribeOn('wrong-data', onResult);
                        return true;
                    }
                    const isSafe = !(await serverController.checkUserName(value));
                    console.log(isSafe, signType)
                    if(!isSafe){
                        clientController.triggerEvent('show-tip', ['This username is exist!', clientController.getColorSetting(2,'red')]);
                    }

                    return isSafe;
                }}/>
                <InputField typeID = {1} defaultValue={'Password'} pattern="password" max={50} min={5} autoComplete={signType === 1? "current-password": "new-password"}
                handleFunctionRef={passwordHandlerRef}
                onValueChange={onPassChange} contextValidate={(value, asyncSetDanger) => {
                    if(signType === 1){
                        function onResult(){
                            asyncSetDanger(() => {clientController.unSubscribeOn('unauthorized', onResult);})
                        }
                        clientController.subscribeOn('unauthorized', onResult);
                        return true;
                    }
                    value = value.split('');

                    const numsCount = value.filter((val) => {
                        return !Number.isNaN(+val);
                    }).length; 
                    const upperCaseCount = value.filter((val) => {
                        return val === val.toUpperCase() && Number.isNaN(+val);
                    }).length;

                    //3 - min numbers, 1 - min uppercase
                    if(numsCount < 3 || upperCaseCount < 1){
                        const message = `Password must contain a: ${numsCount < 3? '3>Numbers': '1>Uppercase'}${numsCount < 3 && upperCaseCount<1? ', 1>Uppercase':''}`;
                        clientController.triggerEvent('show-tip', [message, clientController.getColorSetting(2,'red')]);
                        return false;
                    }
                    return true;
                }}/>
            </form>
            
            {signMessage}
        </ModalWindow>
    );
}


