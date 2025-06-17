import { DataStore } from "./Store";

const ThemeSettings = [
    {
        main: 'var(--main-light-color)',
        functional: 'var(--functional-light-color)',
        functionalActive: 'var(--functional-active-light-color)',
        mainButton: 'var(--main-button-light-color)',
        mainText: 'var(--main-text-light-color)',
        secondaryText: 'var(--secondary-text-light-color)',
        border: 'var(--border-light)',
        borderActive: 'var(--border-light-active)',
    },
    {
        main: 'var(--main-dark-color)',
        functional: 'var(--functional-dark-color)',
        functionalActive: 'var(--functional-active-dark-color)',
        mainButton: 'var(--main-button-dark-color)',
        mainText: 'var(--main-text-dark-color)',
        secondaryText: 'var(--secondary-text-dark-color)',
        border: 'var(--border-dark)',
        borderActive: 'var(--border-dark-active)',
    }
];

export const COLORS = {
    main: 'main',
    functional: 'functional',
    functionalA: 'functionalActive',
    button: 'mainButton',
    text: 'mainText',
    text2: 'secondaryText',
    border: 'border',
    borderA: 'borderActive'
}

const StoreKeys = {
    theme: 'colorTheme',
    subjectTheme: 'subjectTheme',
}

class ClientController{
    theme = 0;
    subjectTheme = 0;
    events = {
        'theme-switch': [],
        'game-start': [],
        'game-finish': [],
    }

    constructor(){
        this.init();
    }
    init(){
        this.theme = !DataStore.checkStored(StoreKeys.theme)? 0: parseInt(DataStore.getStored(StoreKeys.theme));
        this.subjectTheme = !DataStore.checkStored(StoreKeys.subjectTheme)? 0: parseInt(DataStore.getStored(StoreKeys.subjectTheme));
    }
    getColorSettingDefault(type){
        return ThemeSettings[this.theme][type];
    }
    getColorSetting(theme, type){
        return ThemeSettings[theme][type];
    }
    switchTheme(){
        this.theme = !!this.theme? 0: 1;
        console.log(this.theme);
        this.triggerEvent('theme-switch');
        DataStore.Store(StoreKeys.theme, this.theme);
    }
    setSubject(id){
        this.subjectTheme = id;
        DataStore.Store(StoreKeys.subjectTheme, id);
    }

    subscribeOn(event, callback){
        if(!!this.events[event]){
            this.events[event].push(callback);
        }
    }
    triggerEvent(event, props){
        if(!!this.events[event]){
            this.events[event].map((callback) => {
                callback(props);
            });
        }
    }
    unSubscribeOn(event, callback){
        if(!!this.events[event]){
            this.events[event] = this.events[event].filter(val => callback !== val);
        }
        // console.log(this.events["theme-switch"])
        
    }
}

const clientController = new ClientController();

export default clientController;