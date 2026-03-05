import clientController from "./ClientController";
import { DataStore } from "./Store";

const API = process.env.REACT_APP_API_URL;
const SECRET = process.env.REACT_APP_SECRET_KEY;

const endpoints = {
    status: '/status',
    getUserData: '/user/get-data',
    chooseTheme: '/user/choose-theme',
    uploadIcon: '/user/upload-icon',
    getThemes: '/theme/get',
    createTheme: '/theme/create',
    createIntegration: '/theme/create-integration',
    logIn: '/authorize/logIn',
    register: '/authorize/register',
    checkUserName: '/authorize/check-username',
    createQuestion: '/question/create',
    getQuestions: '/question/get',
    answerOnQuestion: '/question/answer',
    getModerating: '/question/moderating',
    moderate: '/question/moderate',
    createGenerationPattern: '/question/create-generation-pattern',
    checkOnModeration: '/question/check-moderator-on-question',
    uploadArticle: '/article/create',
    getArticles: '/article/get',
    static: '/static',
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
        icon: null,
    }

    subjectThemes = [];
    currentQuestions = [];
    news = [];

    earnedPoints = 0;

    constructor() {
        this.token = DataStore.getStored('user-token');

        if(DataStore.checkStored('user-data')){
            const data = DataStore.getStored('user-data');
            if(data !== null){
                this.userData = data;
            }
        }
        if(DataStore.checkStored('subject-list')){
            const subjects = DataStore.getStored('subject-list', (data) => {
                for (const prop of data) {
                    if(typeof prop !== 'object'){
                        return false;
                    }
                }
                return true;
            });

            this.subjectThemes = subjects;
            if(subjects === null){
                DataStore.Store('subject-list', null);
                this.subjectThemes = [];
            }

        }
        if(DataStore.checkStored('news')){
            this.news = DataStore.getStored('news');
        }        
    }

    async init(){
        const onError = (status) => {
            clientController.triggerEvent('doesnt-work');
        }
        const responce = await this.#makeRequest(endpoints.status, 'GET', {}, onError);
        if(!responce) return;
        
        const data = await this.getUserData();
        this.getSubjectThemes();
        this.getNews();
        
        if(!!data) clientController.triggerEvent('loading-complete');
    }

    getStaticLink(file){
        return API + endpoints.static + '/' + file;
    }
    getApi(){
        return API;
    }
    getSecret(){
        return SECRET;
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

        this.earnedPoints += result.points || 0;
    }

    async finishGame(points){
        this.userData.currentGrade += points;
        if(points != this.earnedPoints){
            clientController.triggerEvent('show-tip', [`Your points must be recalculated later [${points}:${this.earnedPoints}]`, clientController.getColorSetting(2, 'yellow')]);
            DataStore.Store('last-points-data', {grade: this.userData.currentGrade, theme: this.userData.chosenTheme.id});
            this.earnedPoints = 0;
        }
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

    async createTheme(theme, onError = () => {}){
        const result = await this.#makeRequest(endpoints.createTheme, 'POST', theme, (status) => onError(status));
        if(result) this.getSubjectThemes();
        
        return result || false;
    }

    async createIntegration(integration, onError = () => {}){
        function Convert(arr){
            return arr.map(val => {
                const [key, value] = val.split(':');
                return {key, value};
            });
        }

        let {headers, params} = integration;
        if(headers) headers = Convert(headers);
        if(params) params = Convert(params);

        const body = {...integration, headers, params, themeId: this.userData.chosenTheme.id};
        const responce = await this.#makeRequest(endpoints.createIntegration, 'POST', body, onError);
        return responce || false;
    }

    async createGenerationPattern(patternData, onError = () => {}){
        const {data} = patternData;
        if(!!data) patternData.data = data.replace(" ", '').split(",");

        const body = {...patternData, theme: this.userData.chosenTheme.id};

        const responce = await this.#makeRequest(endpoints.createGenerationPattern, 'POST', body, onError);
        
        return responce || false;
    }

    async chooseTheme(themeId, title = ''){
        const result = await this.#makeRequest(endpoints.chooseTheme + `?theme=${themeId === undefined? -1: themeId}`, 'POST');
        if(!result) return;
        this.userData.chosenTheme.id = themeId || -1;
        this.userData.chosenTheme.title = title;
        this.userData.accessLevel = result.accessLevel;
        DataStore.Store('user-data', this.userData);        
        clientController.triggerEvent('userdata-loaded');
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
        DataStore.Store('last-points-data', null);
        // clientController.setSubject(null);
        clientController.triggerEvent('unauthorized');
    }

    async register(login, password, adminCode ){
        const body = {
            userName: login,
            password: password,
        };
        if(adminCode !== null && adminCode.length !== 0) body['adminCode'] = adminCode;
        
        const result = await this.#makeRequest(endpoints.register, 'POST', body, (status) => {
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
        DataStore.Store('is-logined-before', true);

        this.init();

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
        DataStore.Store('is-logined-before', true);

        this.init();

        return true;
    }

    async getUserData(onError = (status) => {}){
        const userData = await this.#makeRequest(endpoints.getUserData, 'GET', undefined, (status) => {
            onError(status);
            if(status > 403){
                clientController.triggerEvent('show-tip', ['Something went wrong!', clientController.getColorSetting(2,'red')]);
            }
        });

        if(userData === null){
            return null;
        }

        this.userData = userData;
        
        const lastPointsData = DataStore.getStored('last-points-data');
        if(!!lastPointsData && lastPointsData.theme == this.userData.chosenTheme.id && lastPointsData.grade !== this.userData.currentGrade){
            DataStore.Store('last-points-data', null);
            clientController.triggerEvent('show-tip', ['Points updated!', clientController.getColorSetting(2, 'green')]);
        }
        DataStore.Store('user-data', userData);
        // clientController.

        clientController.triggerEvent('userdata-loaded');
        return userData;
    }

    async getSubjectThemes(onError = () => {}){
        const result = await this.#makeRequest(endpoints.getThemes, 'GET', {}, (status) => {
            onError(status);
            if(status > 403){
                clientController.triggerEvent('show-tip', ['Something went wrong!', clientController.getColorSetting(2,'red')]);
            } 
        });

        if(result === null){
            return null;
        }
        const chosenId = this.userData.chosenTheme.id;
        const found = result.findIndex((val) => val.id === chosenId);
        
        if(found !== -1){
            const subject = result[found];
            result.splice(found, 1);
            result.unshift(subject);
        }

        this.subjectThemes = result;
        DataStore.Store('subject-list', result);

        clientController.triggerEvent('subjectList-updated');

        return result;
    }


    async getNews(onError = () => {}){
        const responce = await this.#makeRequest(endpoints.getArticles, 'GET',{}, onError);
        if(responce !== null && responce.news.length){
            const formed = responce.news.map(val => {
                return {...val, image: val.image && this.getStaticLink(val.image)};
            });

            this.news = formed;
            DataStore.Store('news', [...this.news]);
        }
        clientController.triggerEvent('news-loaded', this.news);
        return this.news;
    }

    async getQuestions(){
        const questionList = await this.#makeRequest(endpoints.getQuestions + `?theme=${this.userData.chosenTheme.id}`);
        if(!questionList){return []};
        this.currentQuestions = [...questionList.list];
        return questionList.list;
    }

    async getQuestionsOnModeration(limit = 3){
        const responce = await this.#makeRequest(endpoints.getModerating + `?theme=${this.userData.chosenTheme.id}&limit=${limit}`, 'GET', null, (status) => {
            clientController.triggerEvent("show-tip", ["Question not found", clientController.getColorSetting(2, "yellow")]);
        });
        if(!responce || responce.questions.length == 0){
            return [];
        }
        
        return responce.questions;
    }
    async checkQuestionsOnModeration(ids = []){
        const responce = await this.#makeRequest(endpoints.checkOnModeration + `?idlist=${ids.join(',')}`);
        if(!responce) return [].fill(false, 0, ids.length-1);

        return responce.questions;
    }
    async moderate(questionID, approved){
        const responce = await this.#makeRequest(endpoints.moderate, 'POST', {
            themeID: this.userData.chosenTheme.id,
            approved, 
            questionID,
            timestamp: new Date(),
        });

        this.userData.moderatedQuestionsCount++;
        this.userData[approved? 'publishedQuestionsCount': 'skippedQuestionsCount']++;
    }

    async uploadIcon(file, onError = () => {}){
        const body = new FormData();
        body.append("file", file, file.name);
        const responce = await this.#makeRequest(endpoints.uploadIcon, 'POST', body, onError, {});
        if(responce){
            this.userData.icon = responce.icon;
            DataStore.Store('user-data', this.userData);
            return true;
        }
        return false;
    }
    async uploadNews({title, image, description, header, background}, onError = () => {}){
        const body = new FormData();
        body.append('title', title);
        if(image !== null) body.append('file', image);
        body.append('description', description);
        body.append('header', header);
        body.append('background', background);

        const responce = await this.#makeRequest(endpoints.uploadArticle, 'POST', body, onError, {});
        if(responce) {
            this.news.unshift({
                title, header, description, background, image
            });
            clientController.triggerEvent('news-loaded', this.news);
        }
        return responce;
    }

    async #makeRequest(endpoint, type = 'GET', body, onError = (status) => {}, headers= {'Content-Type': 'application/json'}){
        const Headers = {
            ...headers,
            'Authorization': `Bearer ${this.token}`,
            'X-target-language': `ua`
        }

        let request = {
            method: type,
            headers: Headers,
        };
        
        if(type === 'POST' && !(body instanceof FormData)){
            request.body = JSON.stringify(body);
        }
        else if(body instanceof FormData){
            request.body = body;
        }

        try{
            const result = await fetch((API + endpoint), request);

            if(result.status >= 400){
                switch(result.status){
                    case 401: clientController.triggerEvent('unauthorized'); break;
                    case 403: clientController.triggerEvent('forbidden'); break;
                    case 404: clientController.triggerEvent('wrong-data'); break;
                }

                throw {
                    message: (await result.json()).message,
                    status: result.status,
                };
            }
            const data = (await result.json());
            return data;
        }
        catch(err){
            onError(err.status, err.message, err);
            console.error(err);
            return null;
        }
    }
}

const serverController = new ServerController();
export default serverController;