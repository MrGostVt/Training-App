import React, { useEffect, useRef, useState } from "react";
import { DefaultButton } from "../components/DefaultButton";
import '../assets/styles/InGame.css'
import { QuestionEngine } from "../application/QuestionsEngine";
import clientController, { COLORS } from "../application/ClientController";
import { QuestionComponent } from "../components/QuestionComponent";
import serverController from "../application/ServerController";

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
        questionData:{question: 'Why i do this shit? Lorem ipsum adkhjkflg hklfjg khfjgklhjfg hjlfkgj hlfjgkl hjfklj', correctAnswerIds:[3], maxPoints: 5,
            answers:[{title: "maks loh", id: 0}, {title: "Skibidi tualet", id: 1}, {title: "mayakovskii", id: 2}, {title: "cause i'm trockyy", id: 3}]}},
    {type: 0, themeId: 0, id: 4, 
        questionData:{question: 'Where are my pants?', correctAnswerIds:[0,1], maxPoints: 5,
            answers:[{title: "Paris", id: 0}, {title: "Ierusalim", id: 1}, {title: "Zhytomyr", id: 2}, {title: "Kyiv", id: 3}]}},
    {type: 1, themeId: 0, id: 5, 
        questionData:{question: 'Set a number order: 2 __ 4 __ 6 __ 8', correctAnswerIds:[2,3,1], maxPoints: 10,
            answers:[{title: "1", id: 0}, {title: "7", id: 1}, {title: "3", id: 2}, {title: "5", id: 3}, {title: "9", id: 4}]}},
];

export const InGamePage = ({moveOut = () => {}}) => {
    const [chosenTheme, setTheme] = useState(clientController.theme);
    const [question, setQuestion] = useState(null);
    const [currentQuest, setCurrent] = useState(0);
    const [chosenAnswer, setChosen] = useState([]);
    const [answers, setAnswers] = useState([]);
    const controllerRef = useRef(null);

    useEffect(() => {
        // const questions = new QuestionEngine(LIST);
        async function getQuestionList() {
            const list = await serverController.getQuestions();

            if(list.length > 0){
                const questions = new QuestionEngine(list);
                controllerRef.current = questions;
                const nextQuestion = questions.getQuestion();
                console.log(nextQuestion);
                setCurrent(1);
                setQuestion(nextQuestion);
                setAnswers(nextQuestion.answers);
            }
            else{
                setTimeout(() => {
                    moveOut(0, false);
                    clientController.triggerEvent('show-tip', ['Questions is not loaded, try again later!', clientController.getColorSetting(2, 'red')])    
                    serverController.finishGame(0);
                }, 2000);
            }
        } 

        getQuestionList();
        return () => {

        }
    }, []);

    return(
        <>
            <QuestionComponent question={question} theme = {chosenTheme}
            number={currentQuest} qty={controllerRef.current? controllerRef.current.getQty(): 0} 
            answers={chosenAnswer}/>
            <Answers answers={answers} theme = {chosenTheme}
            correctCount={question? question.correctCount: 0}
            setCurrentAnswer={(id) => {
                let answers;
                if(chosenAnswer.includes(id)){
                    answers = controllerRef.current.removeAnswer(id);
                }
                else{
                    answers = controllerRef.current.pushAnswer(id);
                }
                setChosen([...answers])
            }}/>
            
            <DefaultButton styles={{bottom: '5%', width: '90%', left: '5%', backgroundColor: clientController.getColorSetting(chosenTheme, COLORS.button)}} 
            onClick={() => {
                if(controllerRef.current !== null && chosenAnswer.length == question.correctCount){
                    const id = controllerRef.current.getQuestion().id;
                    const answers = [...chosenAnswer]
                    serverController.answer(id, answers)

                    const isTrue = controllerRef.current.answer();
                    const nextQuestion = controllerRef.current.getQuestion();
                    const pointer = controllerRef.current.getPointer() + 1;


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



const Answers = ({answers = [{title, id}], correctCount, theme, setCurrentAnswer = () => {}}) => {
    const [chosen, setChosen] = useState([]);
    const border = 'solid 2px var(--main-button-dark-color)';

    useEffect(() => {
        setChosen([]);
    }, [answers])

    return(
        <div className="AnswersList" style={{color: clientController.getColorSetting(theme, COLORS.text)}}>
            {answers.map((val) => (
                <DefaultButton text={val.title} key={val.id} styles={{
                    position: 'relative', 
                    marginBottom: '5%', width: '100%', 
                    border: chosen.includes(val.id)? border: '',
                    backgroundColor: clientController.getColorSetting(theme, COLORS.functional),
                }}
                onClick={() => {
                    const isIncludes = chosen.includes(val.id);
                    let list = [...chosen];
                    if(isIncludes) {
                        list = chosen.filter(id => val.id !== id)
                    }
                    else if(list.length < correctCount){
                        list = [...chosen, val.id];
                    }
                    else{
                        let old = list.pop();
                        setCurrentAnswer(old);
                        list.push(val.id);
                    }
                    setCurrentAnswer(val.id); 
                    setChosen(list); 
                }}/>
            ))}
        </div>
    );
}