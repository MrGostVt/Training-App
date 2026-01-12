import { Question } from "./Question";
// {
//     "id": "59b42c62-19ed-4d8d-ac9d-09450a2754e9",
//     "title": "Где найти полярного медведя4",
//     "level": 1,
//     "maxPoints": 4,
//     "type": 0,
//     "answers": [
//         "test1",
//         "test2",
//         "test3",
//         "test4"
//     ],
//     "rightAnswers": [
//         "1",
//         "2",
//         "3"
//     ]
// },

export class QuestionEngine{
    questions = [];
    pointer = 0;
    answerPoints = [];

    constructor(quests) {
        quests.forEach(val => {
            const quest = new Question(val);
            this.questions.push(quest);
        });
    }
    pushAnswer(answerId){
        const updatedAnswers = this.questions[this.pointer].pushAnswer(answerId);
        return updatedAnswers;
    }
    removeAnswer(answerId){
        const updatedAnswers = this.questions[this.pointer].removeAnswer(answerId);
        return updatedAnswers
    }
    
    answer(){
        const points = this.questions[this.pointer].checkAnswers();
        const maxPoints = this.questions[this.pointer].getData().maxPoints
        this.answerPoints.push([points, maxPoints]);

        this.pointer = this.pointer+1 !== this.questions.length? this.pointer+1: this.pointer;
        return !!points;
    }
    
    getQuestion(){
        return this.questions[this.pointer].getData();
    }
    getQty(){
        return this.questions.length;
    }
    getPointer(){
        return this.pointer;
    }
    getResults(){
        return this.answerPoints;
    }
}

//19.12 ответы на вопросы типа generic Работают, дальше нужно проверить ответы на разные типы вопросов типа created.
//проблема с moderate страницой.