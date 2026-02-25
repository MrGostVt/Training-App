import { DataStore } from "./Store";

const ThemeSettings = [
    {
        main: 'var(--main-light-color)',
        functional: 'var(--functional-light-color)',
        functionalActive: 'var(--functional-active-light-color)',
        mainButton: 'var(--main-button-light-color)',
        mainText: 'var(--main-text-light-color)',
        text: 'var(--text-light-color)',
        textActive: 'var(--text-light-active)',
        secondaryText: 'var(--secondary-text-light-color)',
        thirdText: 'var(--third-text-light-color)',
        border: 'var(--border-light)',
        borderActive: 'var(--border-light-active)',
        defaultBorder: 'var(--default-border-light)',
        borderActive2: 'var(--border-light-active-2)',
        background: 'var(--background-light)',
    },
    {
        main: 'var(--main-dark-color)',
        functional: 'var(--functional-dark-color)',
        functionalActive: 'var(--functional-active-dark-color)',
        mainButton: 'var(--main-button-dark-color)',
        mainText: 'var(--main-text-dark-color)',
        text: 'var(--text-dark-color)',
        textActive: 'var(--text-dark-active)',
        secondaryText: 'var(--secondary-text-dark-color)',
        thirdText: 'var(--third-text-dark-color)',
        border: 'var(--border-dark)',
        borderActive: 'var(--border-dark-active)',
        borderActive2: 'var(--border-dark-active-2)',
        defaultBorder: 'var(--default-border-dark)',
        background: 'var(--background-dark)',
    },
    {
        yellow: 'var(--yellow-exception-color)',
        red: 'var(--red-error-color)',
        green: 'var(--green-okay-color)',
        black: 'black',
    }
];

export const COLORS = {
    main: 'main',
    functional: 'functional',
    functionalA: 'functionalActive',
    button: 'mainButton',
    text: 'mainText',
    text2: 'secondaryText',
    text3: 'text',
    text4: 'thirdText',
    border: 'border',
    borderA: 'borderActive',
    borderD: 'defaultBorder',
    back: 'background',
    textA: 'textActive',
    borderA2: 'borderActive2',
}

const StoreKeys = {
    theme: 'colorTheme',
    subjectTheme: 'subjectTheme',
}

class ClientController{
    theme = 0;
    subjectTheme = undefined;
    events = {
        'resize': [],
        'theme-switch': [],
        'game-start': [],
        'game-finish': [],
        'unauthorized': [],
        'forbidden': [],
        'request-exception': [],
        'show-tip': [],
        'userdata-loaded': [],
        'subjectList-updated': [],
        'wrong-data': [],
    }
    store = {
        
    }
    inModerating = [];

    //возможно стоит настроить сохранение данных.
    questionData = {
        type: null,// 0 - default, 1 - order, 2 - input
        theme: null,
        title: null,
        answers: null,
        rightAnswers: null,
        level: null,
    }
    screenType;

    constructor(){
        this.init();
        window.addEventListener("resize", () => {
            const currentType = this.identifyScreenType();
            if(currentType != this.screenType) {
                this.screenType = currentType;
                this.triggerEvent('resize', currentType);
            }
        }); 
    }
    
    init(){
        this.theme = !DataStore.checkStored(StoreKeys.theme)? 0: parseInt(DataStore.getStored(StoreKeys.theme));
        this.subjectTheme = !DataStore.checkStored(StoreKeys.subjectTheme)? undefined: DataStore.getStored(StoreKeys.subjectTheme);
        this.screenType = this.identifyScreenType();
    }
    identifyScreenType(){
        return window.innerWidth >= 520? 'Desktop': 'Mobile';
    }
    getColorData(color){
        const stage1 = color.split('var(');
        if(stage1.length > 1) {
            const stage2 = stage1[1].split(')')[0];
            color = window.getComputedStyle(document.documentElement).getPropertyValue(stage2);
        }

        return color;
    }
    getColorSettingDefault(type){
        return ThemeSettings[this.theme][type];
    }
    getColorSetting(theme, type){
        return ThemeSettings[theme][type];
    }

    pastelColors = [
        '#EFF6FF', '#ECFDF5', '#FEFCE8',
        '#FDF2F8', '#EEF2FF', '#FFF7ED',
        '#ffc09f', '#ffee93', '#fcf5c7',
        '#a0ced9', '#adf7b6'
    ];
    pastelColors = [
        [
            '#EFF6FF', '#ECFDF5', '#FEFCE8',
            '#FDF2F8', '#EEF2FF', '#FFF7ED',
            '#ffc09f', '#ffee93', '#fcf5c7',
            '#a0ced9', '#adf7b6', "#79addc","#ffc09f","#ffee93","#fcf5c7","#adf7b6"

        ],
        [
            '#2A3C4A', '#3D4722', '#6B4721',
            '#7A4135', '#2C354A', '#8B3A1A',
            "#664d00","#6e2a0c","#691312","#5d0933","#291938","#042d3a","#12403c","#475200"
        ],
    ]
    //"#79addc","#ffc09f","#ffee93","#fcf5c7","#adf7b6"
    
    getRandomPastelColor(){
        const index = Math.round(Math.random() * this.pastelColors[this.theme].length-1); 
        return this.pastelColors[this.theme][index];  
    }
    switchTheme(){
        this.theme = !!this.theme? 0: 1;
        console.log(this.theme);
        this.triggerEvent('theme-switch');
        DataStore.Store(StoreKeys.theme, this.theme);
    }
    
    setQuestionBuilderField(field, value){
        if(!Object(this.questionData).hasOwnProperty(field)){
            console.log("Property not updated");
            return false;
        }
        
        console.log("Property updated");
        this.questionData[field] = value;
        return true;
    }
    
    setSubject(subject){
        console.log(subject);
        this.subjectTheme = subject;
        DataStore.Store(StoreKeys.subjectTheme, subject);
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
    }

    saveModerating(questions){
        DataStore.Store("questions-to-moderate", questions);
        this.inModerating = questions;
        console.log("Save moderating", this.inModerating);
    }
    getModerating(){
        const questions = DataStore.getStored("questions-to-moderate", (data) => {
            if(!!data || data.length !== 0) return true;
            return false;
        });
        this.inModerating = questions || []
        console.log("Get moderating", this.inModerating);
        return this.inModerating;
    }
    getNextModerating(){
        if(!this.inModerating || this.inModerating.length == 0) return null;
        return this.inModerating[0];
    }
    processModerating(){
        this.inModerating.shift();
        this.saveModerating(this.inModerating);
        return true;
    }
}

const clientController = new ClientController();

export default clientController;