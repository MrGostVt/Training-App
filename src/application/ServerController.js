import clientController from "./ClientController";
import { DataStore } from "./Store";

const API = process.env.REACT_APP_API_URL;

const endpoints = {
    getUserData: '/user/get-data',
    chooseTheme: '/user/choose-theme',
    getThemes: '/theme/get',
    createTheme: '/theme/create',
    logIn: '/authorize/logIn',
    register: '/authorize/register',
    checkUserName: '/authorize/check-username',
    createQuestion: '/question/create',
    getQuestions: '/question/get',
    answerOnQuestion: '/question/answer',
    getModerating: '/question/moderating',
    moderate: '/question/moderate',
    createGenerationPattern: '/question/create-generation-pattern',
}

export const AccessLevels = ['Default', 'Creator', 'Moderator', 'Admin'];

class ServerController{
    currentTheme = 0;
    userData = {
        username: '',
        accessLevel: 0,
        chosenTheme: {
            id: '',
            title: '',
        },
        currentGrade: 0,
        createdQuestions: 0,
        publishedQuestions: 0,
        discardedQuestions: 0,
        moderatedQuestionsCount: 0,
        publishedQuestionsCount: 0,
        skippedQuestionsCount: 0,
    }

    subjectThemes = [];
    currentQuestions = [];

    constructor() {
        this.token = DataStore.getStored('user-token');

        if(DataStore.checkStored('user-data')){
            const data = DataStore.getStored('user-data');
            if(data !== null){
                this.userData = data;
            }
        }
        if(DataStore.checkStored('subject-list')){
            const subjects_str = DataStore.getStored('subject-list', (data) => {
                for (const prop of data) {
                    if(typeof prop === 'object'){
                        return true;
                    }
                }
            })

            if(subjects_str === null){
                DataStore.Store('subject-list', null);
                this.subjectThemes = [];
                this.getSubjectThemes();
            }
        }
    }

    async startGame(){
        clientController.triggerEvent('game-start', clientController.subjectTheme);
    }

    async answer(id, answers){
        const currentQuestion = this.currentQuestions.filter((val) => val.id === id)[0];

        const result = await this.#makeRequest(endpoints.answerOnQuestion, 'POST', {
            questionID: currentQuestion.id,
            rightAnswers: answers,
        });
    }

    async finishGame(points){
        this.userData.currentGrade = points;
        this.currentQuestions = [];
        DataStore.Store('user-data', this.userData);
        clientController.triggerEvent('game-finish', {subject: clientController.subjectTheme, points: points});
    }

    loading(time = 2000){
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                console.log('true');
                resolve(true);
            }, time)
        })
    }
    
    async createQuestion(formedData){
        const result = await this.#makeRequest(endpoints.createQuestion, 'POST', formedData);

        return !!result;
    }

    async chooseTheme(themeId, title = ''){
        const result = await this.#makeRequest(endpoints.chooseTheme + `?theme=${themeId === undefined? -1: themeId}`, 'POST');
        this.userData.chosenTheme.id = themeId;
        this.userData.chosenTheme.title = title;
        DataStore.Store('user-data', this.userData)
    }


    async checkUserName(username) {
        const result = (await this.#makeRequest(endpoints.checkUserName+`?username=${username}`, 'GET'));
        if(!result){
            clientController.triggerEvent('show-tip', ['Something went wrong! Try again', clientController.getColorSetting(2,'red')]);
            return false;
        }
        return result.isExist;
    }

    async signOut(){
        this.token = null;
        DataStore.Store('user-token', null);
        DataStore.Store('user-data', null);
        DataStore.Store('subject-theme', null);
        clientController.triggerEvent('unauthorized');
    }

    async register(login, password){
        const result = await this.#makeRequest(endpoints.register, 'POST', {
            userName: login,
            password: password,
        }, (status) => {
            switch(status){
                // case 401: clientController.triggerEvent('show-tip', ['Wrong password! Try again', clientController.getColorSetting(2,'yellow')]); break;
                case 404: clientController.triggerEvent('show-tip', ['Wrong request! Check a data.', clientController.getColorSetting(2,'red')]); break;
                default: clientController.triggerEvent('show-tip', ['Something went wrong! Try again later', clientController.getColorSetting(2,'red')]); break;
            }
        });

        if(!result){
            return false;
        }

        DataStore.Store('user-token', result.token);
        this.token = result.token;

        await this.getUserData();
        await this.getSubjectThemes();

        return true;
    }

    async logIn(login, password){
        const result = await this.#makeRequest(endpoints.logIn, 'POST', {
            userName: login,
            password: password,
        }, (status) => {
            switch(status){
                case 401: clientController.triggerEvent('show-tip', ['Wrong password! Try again', clientController.getColorSetting(2,'red')]); break;
                case 404: clientController.triggerEvent('show-tip', ['User does not exits. Create a new account, or check a data', clientController.getColorSetting(2,'red')]); break;
                default: clientController.triggerEvent('show-tip', ['Something went wrong! Try again later', clientController.getColorSetting(2,'red')]); break;
            }
        });

        if(!result){
            // clientController.triggerEvent('show-tip', 'Wrong data!');
            return false;
        }

        DataStore.Store('user-token', result.token);
        this.token = result.token;

        await this.getUserData();
        await this.getSubjectThemes();

        return true;
    }

    async getUserData(){
        const userData = await this.#makeRequest(endpoints.getUserData, 'GET', undefined, (status) => {
            if(status > 403){
                clientController.triggerEvent('show-tip', ['Something went wrong!', clientController.getColorSetting(2,'red')]);
            }
        });

        if(userData === null){
            return null;
        }

        this.userData = userData;

        DataStore.Store('user-data', userData);

        clientController.triggerEvent('userdata-loaded');
        return userData;
    }

    async getSubjectThemes(){
        const result = await this.#makeRequest(endpoints.getThemes, 'GET', {}, (status) => {
            if(status > 403){
                clientController.triggerEvent('show-tip', ['Something went wrong!', clientController.getColorSetting(2,'red')]);
            } 
        });

        console.log(result)

        if(result === null){
            return null;
        }

        this.subjectThemes = result;
        DataStore.Store('subject-list', JSON.stringify(result));

        clientController.triggerEvent('subjectList-updated');

        return result;
    }

    async getQuestions(){
        const questionList = await this.#makeRequest(endpoints.getQuestions + `?theme=${this.userData.chosenTheme.id}`);
        if(!questionList){return []};
        this.currentQuestions = [...questionList.list];
        return questionList.list;
    }

    async #makeRequest(endpoint, type = 'GET', body, onError = (status) => {}){
        const Headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
        }

        let request = {
            method: type,
            headers: Headers,
        };
        
        if(type === 'POST'){
            request.body = JSON.stringify(body);
        }

        console.log(request);

        try{
            const result = await fetch((API + endpoint), request);

            if(result.status >= 400){
                switch(result.status){
                    case 401: clientController.triggerEvent('unauthorized'); break;
                    case 403: clientController.triggerEvent('forbidden'); break;
                    case 404: clientController.triggerEvent('wrong-data'); break;
                }

                throw {
                    message: result.status + ' Something wrong',
                    status: result.status,
                };
            }
            const data = (await result.json());
            return data;
        }
        catch(err){
            onError(err.status, err.message, err);
            return null;
        }
    }
}

const serverController = new ServerController();
export default serverController;