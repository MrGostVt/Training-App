import React, { useEffect } from "react";
import { useState, useRef } from "react";
import clientController, { COLORS } from "../application/ClientController";
import { ModalWindow } from "./ModalWindow";
import { InfoBlock } from "./InfoBlock";
import { InputField } from "./InputField";
import { DefaultButton } from "./DefaultButton";
import { LoadedImages } from "../application/ImageLoad";
import { Switch } from "./Switch";
import PlusIcon from "../assets/icons/Plus.svg"
import { QuestionComponent } from "./QuestionComponent";
import { Question } from "../application/Question";
import { TextPreview } from "./TextPreview";

export const ProcessQuestionsModal = ({closeCallback = () => {}}) => {
    const [processType, setProcessType] = useState(0);

    let field;
    const backLink = <a className="backLink DefaultFont" onClick={() => setProcessType(0)} style={{
        color: clientController.getColorSettingDefault(COLORS.text2)
    }}>Move back</a>
    const defaultButton = {
        title: "Exit",
        isActive: true,
        function: () => {}
    };
    switch(processType){
        case 2: field = <ModerateQuestionField />; defaultButton.isActive = false; break;
        case 1: field = <CreateQuetionField/>; defaultButton.title = 'Create'; break;
        default: field = <InfoWrap onClick1={() => setProcessType(1)} onClick2={() => setProcessType(2)} />; break;
    }


    return(
        <ModalWindow title="Moderation" size={1} closeCallback={closeCallback} defaultButton={defaultButton}>
            {processType !== 0? backLink: null}
            {field}
        </ModalWindow>
    );
}

const InfoWrap = ({onClick1 = () => {}, onClick2 = () => {}}) => (
    <div className="InfoWrap">
            <InfoBlock title="Create Question" button={{title: 'Create', function: onClick1}} icounUrl={LoadedImages['Idea.png']}
            text={'Create questions on the topic!'} statistics={[{title: 'Created', score: 9}, {title: 'Published', score: 2}]}/>
            <InfoBlock title="Moderate Question" button={{title: 'Moderate', function: onClick2}} icounUrl={LoadedImages['Practice.png']}
            text={'Moderate other peoples questions!'} statistics={[{title: 'Published', score: 9}, {title: 'Skipped', score: 2}]}/>
    </div>
);


function getSquareStyles() {

    return{
        backgroundColor: clientController.getColorSettingDefault(COLORS.functionalA),
        position: 'relative',
    };
}

const CreateQuetionField = ({}) => {
    const [questType, setQuestType] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [rightAnswers, setRightAnswers] = useState([]);
    const answerTitleClearRef = useRef(() => {});

    const [question, setQuestion] = useState({
        title: '',
        state: false,
    });
    const [answerTitle, setAnswerTitle] = useState({
        title: '',
        state: false,
    });

    function updateQuestion(title, state){
        setQuestion({
            title,
            state: state === 2,
        });
    }
    function removeAnswer(id){
        let list = [...answers];
        list = answers.filter(val => val.id !== id);
        
        setAnswers(list);
        if(rightAnswers.includes(id)){
            updateRight(id);
        }
    }
    function addAnswer(){
        if(answerTitle.state && answers.length < 7){
            let list = [...answers];

            list.push({
                title: answerTitle.title,
                id: list.length,
            });
    
            setAnswers(list);
            setAnswerTitle({
                title: '',
                state: false,
            });
            answerTitleClearRef.current();
        }
    }
    function updateLastAnswer(title, state){
        setAnswerTitle({
            title,
            state: state === 2
        });
    }
    function updateRight(id){
        let correct = [...rightAnswers];
        if((questType === 0 && correct.length === 0 || correct.includes(id)) 
        || (questType === 1 && correct.length !== answers.length - 1)
        || (questType === 2)){
            if(correct.includes(id)){
                correct = correct.filter(val => id !== val);
            }
            else{
                correct.push(id);
            }
            
            setRightAnswers(correct);
        }
    }
    function replaceRightAnswers(index){
        let correct = [...rightAnswers];
        const answer = correct[index];
        correct.splice(index, 1);
        correct.splice(index === correct.length? 0: index + 1, 0, answer);

        setRightAnswers(correct);
    }


    return(
        // TODO: Update margins. Maybe should add a padding or smthing like that to root (Modal window)
        <div className="DefaultFont" style={{
            position: 'relative',
            height: '14vh',
            color: clientController.getColorSettingDefault(COLORS.text2),
            textAlign: 'center',
        }}>
            <Switch title={"Type"} callback={(val) => {setQuestType(val); setRightAnswers([]);}} current={questType}
            values={[
                {val: 0, prev: 'Default', descrip: 'One Answer'}, 
                {val: 1, prev: 'Several', descrip: 'Several answers'}, 
                {val: 2, prev: 'Order', descrip: 'Use "__" to indicate answers in question'}]}
            />
            <InputField min={5} max={50} pattern="question" styles={{left: '5%', width: '90%'}} onValueChange={updateQuestion}
            defaultValue={`Create a question. Max 50 symbols.`}/>
            <div className="AnswersList" style={{
                height: '20vh',
                overflowY: 'auto',
            }}>
                {answers.map((val, id) => (
                    <AnswerBlock val={val}
                    onAnswerClick={() => updateRight(val.id)}
                    onOrderDisplayClick={() => replaceRightAnswers(rightAnswers.indexOf(val.id))}
                    onDeleteClick={() => removeAnswer(val.id)}
                    isOrderDisplayed={questType === 2 && rightAnswers.includes(val.id)}
                    number={rightAnswers.indexOf(val.id) + 1}
                    isCorrect={rightAnswers.includes(val.id)}
                    isDeleteDisplayed={true}
                    />
                    
                ))}
                <div style={{
                    display: 'flex',
                    marginTop: '0.5%',
                }}>
                    <InputField defaultValue={'Add an answer.'} max={25} min={1} onValueChange={updateLastAnswer}
                    clearFunctionRef={answerTitleClearRef}
                    pattern="question" styles={{width: '80%', marginBottom: '1%%', marginRight: '9%'}} />
                    <DefaultButton text={<PlusIcon />} onClick={addAnswer}
                    styles={{
                        height: '5.5vh',
                        width: '5.5vh',
                        ...getSquareStyles()
                    }}>
                    </DefaultButton>
                </div>
            </div>
        </div>
    );
}

let test = {type: 0, themeId: 0, id: 0, 
    questionData:{question: 'What is the capital of France?', correctAnswerIds:[0], maxPoints: 5,
        answers:[{title: "Paris", id: 0}, {title: "Ierusalim", id: 1}, {title: "Zhytomyr", id: 2}, {title: "Kyiv", id: 3}]}};
test = {type: 1, themeId: 0, id: 5, 
    questionData:{question: 'Set a number order: 2 __ 4 __ 6 __ 8', correctAnswerIds:[2,3,1], maxPoints: 10,
        answers:[{title: "1", id: 0}, {title: "7", id: 1}, {title: "3", id: 2}, {title: "5", id: 3}, {title: "9", id: 4}]}};

const ModerateQuestionField = ({}) => {
    const [question, setQuestion] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [correct, setCorrect] = useState([]);

    useEffect(() => {
        const testQuest = new Question(test.type, test.themeId, test.id, test.questionData);
        const questionData = testQuest.getData();
        const correct = testQuest.getCorrectAnswersIDs();

        setQuestion(questionData);
        setAnswers(questionData.answers);
        setCorrect(correct);
    }, [])

    if(!question){
        return null;
    }
    return(
        <div style={{position: 'relative',left: '5%',width: '90%'}}>
            <h3 className="DefaultFont" style={{color: clientController.getColorSettingDefault(COLORS.text)}}>Question</h3>
            <TextPreview text={question.question} textStyles={{textAlign: 'center'}}/>
            <h3 className="DefaultFont" style={{color: clientController.getColorSettingDefault(COLORS.text)}}>Answers</h3>
            <div className="ScrollBar" style={{
                maxHeight: '25vh',
                overflow: 'auto',
                marginBottom: '3%'
            }}>
                {answers.map((val) => (
                    <AnswerBlock val={val} key={val.id} number={correct.indexOf(val.id) + 1}
                    isOrderDisplayed={question.type === 1 && correct.includes(val.id)}
                    isCorrect={correct.includes(val.id)}/>
                ))}
            </div>
            <div>
                <DefaultButton text="Skip" styles={{position: 'absolute', left: '0'}}/>
                <DefaultButton text="Publish" styles={{position: 'absolute', right: '0'}}/>
            </div>
        </div>
    );
}

const AnswerBlock = ({val, isOrderDisplayed = false, number = 0, isCorrect = false, isDeleteDisplayed = false,
    onAnswerClick = () => {}, onOrderDisplayClick = () => {}, onDeleteClick = () => {}}) => {
    
    return(
        <div key={val.id} style={{
            display: 'flex',
            marginTop: '0.5%',
        }}>
            <DefaultButton text={val.title} styles={{
                position: 'relative',
                backgroundColor:clientController.getColorSettingDefault(COLORS.functionalA),
                color: clientController.getColorSettingDefault(COLORS.text),
                marginBottom: '1.5%',
                height: '4vh',
                width: '80%',
                filter: isCorrect? 'drop-shadow(rgb(9, 255, 0) 0px 4px 0px)': '',
                marginRight: isOrderDisplayed? '3%': '12%'
            }} onClick={onAnswerClick}/>
            {isOrderDisplayed? 
                <DefaultButton text={number} styles={{
                    height: '3.5vh',
                    width: '3.5vh',
                    marginRight: '2%',
                    color: clientController.getColorSettingDefault(COLORS.text),
                    ...getSquareStyles()
                }} onClick={onOrderDisplayClick}/>
            :null
            }
            {isDeleteDisplayed?
                <DefaultButton text={<PlusIcon className={'XIcon'}/>} onClick={onDeleteClick}
                styles={{
                    height: '3.5vh',
                    width: '3.5vh',
                    ...getSquareStyles()
                }}/>
            :null
            }
        </div>
    );
}