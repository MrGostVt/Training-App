export class Question{
    type = null;
    themeId = null;
    answerType = null;
    questionData = null;
    isRight = false;
    earnedPoints = 0;
    chosenAnswers = [];

    //type: Question type, 0 - default, 1 - order of answers
    constructor(
    questionData = {title: '',  rightAnswers: [-1], answers: [], maxPoints, level, type, id,}){
        this.type = questionData.type;
        this.questionData = questionData;
        this.questionData.answers = this.formAnswers(questionData.answers);
        this.questionData.answers = this.shuffleAnswers(this.questionData.answers);
    }

    formAnswers(answers = []){
        const formedAnswers = answers.map((val, id) => {
            return {title: val, id}
        })
        return formedAnswers;
    }

    getData(){
        console.log(this.questionData)

        const data = {
            question: this.questionData.title,
            type: this.type,
            answers: this.questionData.answers,
            maxPoints: this.questionData.maxPoints,
            id: this.questionData.id,
            correctCount: this.questionData.rightAnswers.length,
        };

        return data;
    }
    shuffleAnswers(answers){
        let ids = [];
        const list = [];
        for(let id in answers){
            ids.push(id);
        }
        // console.log(answers);
        console.log('yeah yeah')
        // console.log(ids);

        let count = 0;
        while(ids.length != 0){
            const id = parseInt(Math.random() * ids.length);
            list.push(answers[ids[id]]);
            ids = ids.filter((val) => val !== ids[id]);
            
            count++;
            if(count == 25){
                break;
            }
        }
        return list;
    }

    pushAnswer(answerId = -1){
        switch(this.type){
            // case 1:  break;
            default: if(this.chosenAnswers.length < this.questionData.rightAnswers.length) this.chosenAnswers.push(answerId); break;
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
        
        for(const correctId of this.questionData.rightAnswers){
            if(this.chosenAnswers.includes(correctId)){
                correctAnswers++;
            }
        }
        const points = parseInt(correctAnswers/question.rightAnswers.length * question.maxPoints);
        this.earnedPoints = points;
        
        return points;
    }

    checkAnswerWithOrder(){
        const question = this.questionData;

        if(this.chosenAnswers.length !== this.questionData.rightAnswers.length){
            this.earnedPoints = 0;
            return this.earnedPoints;
        }
        for(let i = 0; i < question.rightAnswers.length; i++){
            if(this.chosenAnswers[i] !== question.rightAnswers[i]){
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

    getCorrectAnswersIDs(){
        return this.questionData.rightAnswers;
    }
}
