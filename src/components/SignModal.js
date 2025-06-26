import React from "react";
import { ModalWindow } from "./ModalWindow";
import { InputField } from "./InputField";

const messageStyles = {
    position: 'absolute',
    left: '5%',
    bottom: '28%',
    color: clientController.getColorSettingDefault(COLORS.text),
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

    let signMessage = <div className="DefaultFont" style={messageStyles} onClick={() => {setSignType(0)}}>New user? Sign Up</div>;
    if(signType === 0){
        signMessage = <div className="DefaultFont" style={messageStyles} onClick={() => {setSignType(1)}}>Already have an account? Sign In</div>
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
        <ModalWindow title={signType === 0? 'Sign In': 'Sign Up'} closeCallback={closeCallback} isBackgroundClose={false}
        defaultButton={{isActive: true, title:signType === 0? 'SIGN IN': 'SIGN UP', function: async () => {
                await serverController.loading(1500)
                return passInfo.state && logInfo.state;
            }}}>

            {/* <DefaultButton styles={{width: '90%', height: '8vh', left: '5%', bottom: '15%', fontWeight: '700',
                backgroundColor: `var(--main-button-dark-color)`, color: 'var(--main-text-dark-color)'}} text="SIGN IN"
            /> */}
            <div className="SignWrap">
                <InputField typeID = {0} defaultValue={'Username'} pattern="login" max={25} min={3}
                onValueChange={onLogChange}/>
                <InputField typeID = {1} defaultValue={'Password'} pattern="password" max={30} min={6}
                onValueChange={onPassChange}/>
            </div>
            
            {signMessage}
        </ModalWindow>
    );
}


