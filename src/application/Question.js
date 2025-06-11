export class Question{
    type = null;
    themeId = null;
    answerType = null;
    questionData = null;
    isRight = false;
    earnedPoints = 0;
    chosenAnswers = [];

    //type: Question type, 0 - default, 1 - order of answers
    constructor(type, themeId, id,
    questionData = {question: '',  correctAnswerIds: [-1], answers: [], maxPoints}){
        this.type = type;
        this.themeId = themeId;
        this.questionData = questionData;
        this.questionData.id = id;
    }
    getData(){
        const data = {
            question: this.questionData.question,
            type: this.type,
            answers: this.questionData.answers,
            maxPoints: this.questionData.maxPoints,
            id: this.questionData.id,
            correctCount: this.questionData.correctAnswerIds.length,
        };

        return data;
    }

    pushAnswer(answerId = -1){
        switch(this.type){
            // case 1:  break;
            default: if(this.chosenAnswers.length < this.questionData.correctAnswerIds.length) this.chosenAnswers.push(answerId); break;
        }
        return this.chosenAnswers;
    }

    removeAnswer(answerId){
        this.chosenAnswers = this.chosenAnswers.filter(val => val !== answerId);
        return this.chosenAnswers;
    }

    checkAnswerDefault(){
        let correctAnswers = 0;
        const question = this.questionData;
        
        for(const correctId of this.questionData.correctAnswerIds){
            if(this.chosenAnswers.includes(correctId)){
                correctAnswers++;
            }
        }
        const points = parseInt(correctAnswers/question.correctAnswerIds.length * question.maxPoints);
        this.earnedPoints = points;
        
        return points;
    }

    checkAnswerWithOrder(){
        const question = this.questionData;

        if(this.chosenAnswers.length !== this.questionData.correctAnswerIds.length){
            this.earnedPoints = 0;
            return this.earnedPoints;
        }
        for(let i = 0; i < question.correctAnswerIds.length; i++){
            if(this.chosenAnswers[i] !== question.correctAnswerIds[i]){
                this.earnedPoints = 0;
                return this.earnedPoints;
            }
        }

        this.earnedPoints = question.maxPoints;
        return this.earnedPoints;
    }

    checkAnswers(){
        switch(this.type){
            case 1: return this.checkAnswerWithOrder();
            default: return this.checkAnswerDefault();
        }
    }
}
