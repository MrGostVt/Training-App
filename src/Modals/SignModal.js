import React, {  useEffect, useRef, useState } from "react";
import { ModalWindow } from "./ModalWindow";
import { InputField } from "../components/InputField"
import clientController from "../application/ClientController";
import { COLORS } from "../application/ClientController";
import serverController from "../application/ServerController";
import { DataStore } from "../application/Store";

const messageStyles = {
    position: 'absolute',
    left: '5%',
    bottom: '90px',
    width: '90%',
    textAlign: 'center',
};

export const SignModal = ({closeCallback = () => {}}) => {
    const [signType, setSignType] = useState(!!DataStore.getStored('is-logined-before')? 1: 0);
    const [passInfo, setPassInfo] = useState({
        pass: '',
        state: false,
    });
    const [logInfo, setLogInfo] = useState({
        log: '',
        state: false,
    });

    const [adminCode, setAdminCode] = useState({
        code: '',
        state: false,
    });
    const passwordHandlerRef = useRef(() => {});
    const loginHandlerRef = useRef(() => {});
    const adminCodeRef = useRef(() => {});
    const formRef = useRef(undefined);

    useEffect(() => {
        setAdminCode({code: '', state: false});
        if(passInfo.pass.length !== 0){ passwordHandlerRef.current(passInfo.pass); }
        if(logInfo.log.length !== 0){ loginHandlerRef.current(logInfo.log); }
        adminCodeRef.current = '';
    }, [signType]);

    let signMessage = <div className="DefaultFont" style={{...messageStyles, color: clientController.getColorSettingDefault(COLORS.text)}} onClick={() => {
        setSignType(() => {
            return 0;
        });
    }}>New user? Sign Up</div>;
    if(signType === 0){
        signMessage = <div className="DefaultFont" style={{...messageStyles, color: clientController.getColorSettingDefault(COLORS.text)}} onClick={() => {
            setSignType(() => {
                return 1;
            });
        }}>Already have an account? Sign In</div>
    }

    function onPassChange(val, state){
        setPassInfo({
            pass: val,
            state: state === 2,
        });     
    }
    function onLogChange(val, state){
        console.log('onLogChange!', val);
        if(signType === 0 && val === serverController.getSecret()){
            setAdminCode({code: '', state: true});
        }
        setLogInfo({
            log: val,
            state: state === 2
        });
    }

    return(
        <ModalWindow title={signType === 1? 'Sign In': 'Sign Up'} closeCallback={closeCallback} isBackgroundClose={false}
        size={signType === 0? adminCode.state? 3: 0: 0}
        defaultButton={{isActive: true, title:signType === 1? 'SIGN IN': 'SIGN UP', type:'submit', function: async () => {
                const formData = new FormData(formRef.current);
                const formLogin = formData.get('username');
                const formPassword = formData.get('password'); 

                if(formLogin !== logInfo.log || formPassword !== passInfo.pass){
                    clientController.triggerEvent('show-tip', ['Wait a second before submitting', clientController.getColorSetting(2, 'red')])
                    return false;
                }

                if(passInfo.state && logInfo.state){
                    if(signType === 1){
                        const isOk = await serverController.logIn(logInfo.log, passInfo.pass);
                        return isOk;
                    }
                    
                    const isOk = await serverController.register(logInfo.log, passInfo.pass, adminCode.state? adminCode.code: null);
                    return isOk;
                }
                return false;
            }}}>
            <form ref={formRef} className="SignWrap" autoComplete="on" method="post" onInput={(ev) => {console.log('INPUT GA')}}> 
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
                handleFunctionRef={passwordHandlerRef} hideButton={true}
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
                {
                    signType === 0 && adminCode.state === true?
                    <InputField typeID={0} ref={adminCodeRef} max={150} defaultValue={"Admin code"} onValueChange={(val, state) => {
                        if(state === 2) setAdminCode({code: val, state: true});
                        else setAdminCode({code: '', state: true});
                    }}/>
                    : null
                }
            </form>
            
            {signMessage}
        </ModalWindow>
    );
}


