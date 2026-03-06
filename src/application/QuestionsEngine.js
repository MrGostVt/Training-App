import { Question } from "./Question";

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