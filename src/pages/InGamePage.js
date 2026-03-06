import React, { useEffect, useRef, useState } from "react";
import { DefaultButton } from "../components/DefaultButton";
import '../assets/styles/InGame.css'
import { QuestionEngine } from "../application/QuestionsEngine";
import clientController, { COLORS } from "../application/ClientController";
import { QuestionComponent } from "../components/QuestionComponent";
import serverController from "../application/ServerController";

export const InGamePage = ({moveOut = () => {}, setLoading = () => {}}) => {
    const [chosenTheme, setTheme] = useState(clientController.theme);
    const [question, setQuestion] = useState(null);
    const [currentQuest, setCurrent] = useState(0);
    const [chosenAnswer, setChosen] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [screen, setScreen] = useState(clientController.identifyScreenType());
    const controllerRef = useRef(null);

    useEffect(() => {
        // const questions = new QuestionEngine(LIST);
        async function getQuestionList() {
            const list = await serverController.getQuestions();

            if(list.length > 0){
                const questions = new QuestionEngine(list);
                controllerRef.current = questions;
                const nextQuestion = questions.getQuestion();
                setCurrent(1);
                setQuestion(nextQuestion);
                setAnswers(nextQuestion.answers);
                setLoading(false);
            }
            else{
                setTimeout(() => {
                    setLoading(false);
                    moveOut(0, false);
                    clientController.triggerEvent('show-tip', ['Questions is not loaded, try again later!', clientController.getColorSetting(2, 'red')])    
                    serverController.finishGame(0);
                }, 2000);
            }
        } 
        function handleResize(type){
            setScreen(type);
        }

        getQuestionList();
        clientController.subscribeOn('resize', handleResize);
        return () => {
            clientController.unSubscribeOn('resize', handleResize);
        }
    }, []);

    return(
        <>
            <QuestionComponent question={question} theme = {chosenTheme}
            number={currentQuest} qty={controllerRef.current? controllerRef.current.getQty(): 0} 
            answers={chosenAnswer}/>
            <Answers answers={answers} theme = {chosenTheme} screen={screen}
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
            
            <DefaultButton styles={{ 
                position: question?'sticky':'absolute', bottom: '5vh', 
                width: '90%', left: 0, right: 0, margin: '0 auto',
                backgroundColor: clientController.getColorSetting(chosenTheme, COLORS.button),
                color: clientController.getColorSetting(chosenTheme, COLORS.text4),
                fontWeight: 500, fontSize: '16px'
            }} 
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
                else clientController.triggerEvent('show-tip', [`Choose ${question.correctCount} answers!`, clientController.getColorSetting(2, 'yellow')]);
                
            }} text="Done"/>
        </>
    )
}



const Answers = ({answers = [{title, id}], correctCount, theme, screen, setCurrentAnswer = () => {}}) => {
    const [chosen, setChosen] = useState([]);
    const [colors, setColors] = useState([])
    const border = 'solid 2px ' + clientController.getColorSetting(theme, COLORS.borderA2);

    useEffect(() => {
        setChosen([]);
        setColors(answers.map(() => ( clientController.getRandomPastelColor())));
    }, [answers]);

    const desktopStyles = screen !== 'Desktop'? {}: {
        aspectRatio: '1', height: 'auto', justifySelf: 'center',
        fontSize: '32px', marginTop: '4px', fontWeight: 600,
    } 

    return(
        <div className="AnswersList" style={{color: clientController.getColorSetting(theme, COLORS.text)}}>
            {answers.map((val, id) => (
                <DefaultButton text={val.title} key={val.id} styles={{
                    position: 'relative', margin: '0 auto', 
                    marginBottom: '25px', width: '100%', maxWidth: '500px',
                    border: chosen.includes(val.id)? border: '', 
                    backgroundColor: colors[id],
                    ...desktopStyles
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
            <div style={{position: 'relative', height: '10vh'}}></div>
        </div>
    );
}