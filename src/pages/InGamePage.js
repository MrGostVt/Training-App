import React, { useEffect, useRef, useState } from "react";
import { DefaultButton } from "../components/DefaultButton";
import '../assets/styles/InGame.css'
import { QuestionEngine } from "../application/QuestionsEngine";
const LIST = [
    {type: 0, themeId: 0, id: 0, 
        questionData:{question: 'What is the capital of France?', correctAnswerIds:[0], maxPoints: 5,
            answers:[{title: "Paris", id: 0}, {title: "Ierusalim", id: 1}, {title: "Zhytomyr", id: 2}, {title: "Kyiv", id: 3}]}},
    {type: 0, themeId: 0, id: 1, 
        questionData:{question: 'What is the capital of world', correctAnswerIds:[2], maxPoints: 5,
            answers:[{title: "Paris", id: 0}, {title: "Ierusalim", id: 1}, {title: "Zhytomyr", id: 2}, {title: "Kyiv", id: 3}]}},
    {type: 0, themeId: 0, id: 2, 
        questionData:{question: 'What is the capital of jewish', correctAnswerIds:[0], maxPoints: 5,
            answers:[ {title: "Ierusalim", id: 0}, {title: "Zhytomyr", id: 1}, {title: "Kyiv", id: 2}]}},
    {type: 0, themeId: 0, id: 3, 
        questionData:{question: 'Why i do this shit?', correctAnswerIds:[3], maxPoints: 5,
            answers:[{title: "porno", id: 0}, {title: "Skibidi tualet", id: 1}, {title: "mayakovskii", id: 2}, {title: "cause i'm trockyy", id: 3}]}},
    {type: 0, themeId: 0, id: 4, 
        questionData:{question: 'Where are my pants?', correctAnswerIds:[4], maxPoints: 5,
            answers:[{title: "Paris", id: 0}, {title: "Ierusalim", id: 1}, {title: "Zhytomyr", id: 2}, {title: "Kyiv", id: 3}]}},
];

export const InGamePage = ({moveOut = () => {}}) => {
    const [question, setQuestion] = useState(null);
    const [currentQuest, setCurrent] = useState(0);
    const [chosenAnswer, setChosen] = useState([]);
    const [answers, setAnswers] = useState([]);
    const controllerRef = useRef(null);

    useEffect(() => {
        const questions = new QuestionEngine(LIST);
        controllerRef.current = questions;
        const nextQuestion = questions.getQuestion();
        console.log(nextQuestion);
        
        setCurrent(1);
        setQuestion(nextQuestion);
        setAnswers(nextQuestion.answers);
    }, []);
    
    return(
        <>
            <Question question={question? question.question: 'Loading...'} number={currentQuest} qty={controllerRef.current? controllerRef.current.getQty(): 0}/>
            <Answers answers={answers}
            setCurrentAnswer={(id) => {
                let answers;
                if(chosenAnswer.includes(id)){
                    answers = controllerRef.current.removeAnswer(id);
                }
                else{
                    answers = controllerRef.current.pushAnswer(id);
                }
                setChosen(answers)
            }}/>
            
            <DefaultButton styles={{bottom: '5%', width: '90%', left: '5%', backgroundColor: `var(--main-button-dark-color)`}} 
            onClick={() => {
                if(controllerRef.current !== null && chosenAnswer.length !== 0){
                    const isTrue = controllerRef.current.answer();
                    const nextQuestion = controllerRef.current.getQuestion();
                    const pointer = controllerRef.current.getPointer() + 1;

                    console.log(isTrue);
                    if(pointer === currentQuest){
                        const results = controllerRef.current.getResults();
                        moveOut(results);
                    }
                    else{
                        setChosen([]);
                        setCurrent(pointer);
                        setQuestion(nextQuestion);
                        setAnswers(nextQuestion.answers);
                    }
                }
            }} text="Done"/>
        </>
    )
}

const Question = ({question, number, qty}) => {

    return(
        <div className="DefaultFont Question">   
            {`Question ${number}/${qty}`}
            <p style={{fontSize: '16px', textAlign: 'center'}}>{question}</p>
        </div>
    );
}

const Answers = ({answers = [{title, id}], setCurrentAnswer = () => {}}) => {
    const [chosen, setChosen] = useState(-1);
    const border = 'solid 2px var(--main-button-dark-color)';

    useEffect(() => {
        setChosen(-1);
    }, [answers])

    return(
        <div className="AnswersList">
            {answers.map((val) => (
                <DefaultButton text={val.title} key={val.id} styles={{
                    position: 'relative', 
                    marginBottom: '5%', width: '100%', 
                    border: chosen == val.id? border: '',
                }}
                onClick={() => {
                    const answer = val.id === chosen? -1: val.id
                    setCurrentAnswer(answer); 
                    setChosen(answer); 
                }}/>
            ))}
        </div>
    );
}