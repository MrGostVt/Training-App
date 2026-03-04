import React, { useCallback, useEffect } from "react";
import { useState, useRef } from "react";
import clientController, { COLORS } from "../application/ClientController";
import { ModalWindow } from "./ModalWindow";
import { InfoBlock } from '../components/InfoBlock';
import { InputField } from "../components/InputField";
import { DefaultButton } from "../components/DefaultButton";
import { LoadedImages } from "../application/ImageLoad";
import { Switch } from "../components/Switch";
import PlusIcon from "../assets/icons/Plus.svg"
import { QuestionComponent } from "../components/QuestionComponent";
import { Question } from "../application/Question";
import { TextPreview } from "../components/TextPreview";
import serverController, { AccessLevels } from "../application/ServerController";

export const ProcessQuestionsModal = ({closeCallback = () => {}}) => {
    const [processType, setProcessType] = useState(0);
    const [data, setData] = useState(null);

    let field;
    let modalTitle;
    const backLink = <a className="backLink DefaultFont" onClick={() => setProcessType(0)} style={{
        color: clientController.getColorSettingDefault(COLORS.text2)
    }}>Move back</a>
    const defaultButton = {
        title: "Exit",
        isActive: true,
        function: () => true
    };
    switch(processType){
        case 3: 
            field = <CreatePatternField setData={setData}/>; 
            modalTitle = 'Create a pattern';
            defaultButton.title = 'Create';
            defaultButton.isActive = true;
            defaultButton.function = async () => {
                const {pattern, maxPoints, type, level} = data;
                if(!pattern || pattern.length < 4) return false;
                if(!maxPoints || type === null || level === null) return false;
                const result = await serverController.createGenerationPattern({...data}, (status, message) => {
                    clientController.triggerEvent('show-tip', [message, clientController.getColorSetting(2, 'red')]);
                });
                
                if(result) clientController.triggerEvent('show-tip', ['Success', clientController.getColorSetting(2, 'green')]);
                return result;
            }
        
        break;
        case 2: 
            field = <ModerateQuestionField />; defaultButton.isActive = false; defaultButton.function = () => {
                return false;
            }; 
            modalTitle = 'Moderate questions';
            break;
        case 1: 
            field = <CreateQuestionField/>; 
            defaultButton.title = 'Create'; 
            defaultButton.function = async () => {
                const data = {...clientController.questionData};     
                const wrongProps = [];
                for (const property in data) {
                    if(data[property] === null || data[property].length === 0){
                        wrongProps.push(property);
                    }
                }       
                if(wrongProps.length !== 0){
                    clientController.triggerEvent('show-tip', [`${wrongProps.join(', ')} must be valid.`, clientController.getColorSetting(2, 'red')]);
                    return false;
                }

                const answersList = data.answers.map(val => val.title);
                const rightAnswersList = data.rightAnswers.map(value => data.answers.findIndex(val => value === val.id));

                const formedQuestion = {
                    title: data.title, 
                    level: data.level, 
                    type: data.type <= 1? 0: 1, 
                    answers: answersList, 
                    rightAnswers: rightAnswersList, 
                    theme: 1
                }

                const result = await serverController.createQuestion(formedQuestion);
                if(result) clientController.triggerEvent('show-tip', ['Success!', clientController.getColorSetting(2, 'green')]);
                
                return result;
            }; 
            modalTitle = 'Create a question';
            break;
        default: 
            field = <InfoWrap onClick={[() => {
                if(serverController.userData.accessLevel > 0){
                    setProcessType(1);
                    return;
                }
                clientController.triggerEvent('show-tip', 
                    [`Improve your topic level to get a ${AccessLevels[1]} access!`, 
                    clientController.getColorSetting(2, 'yellow')]
                );
            },
            () => {
                if(serverController.userData.accessLevel > 1){
                    setProcessType(2)
                    return;
                }
                clientController.triggerEvent('show-tip', 
                    [`Improve your topic level to get a ${AccessLevels[2]} access!`, 
                    clientController.getColorSetting(2, 'yellow')]
                );
            },
            () => {
                if(serverController.userData.accessLevel === 3){
                    setProcessType(3);
                    return;
                }
            },
            ]}/>; 
            modalTitle = 'Chose an activity'
            break;
    }


    return(
        <ModalWindow title={modalTitle} size={1} closeCallback={closeCallback} defaultButton={defaultButton}>
            {processType !== 0? backLink: null}
            {field}
        </ModalWindow>
    );
}

const InfoWrap = ({onClick = []}) => (
    <div className="InfoWrap" style={{
        justifyContent: serverController.userData.accessLevel === 3? 'left': 'center'
    }}>
            <InfoBlock title="Create a Question" button={{title: 'Create', function: onClick[0]}} icounUrl={LoadedImages['Idea.png']}
            text={'Create questions on the topic!'} statistics={[
                {title: 'Created', score: serverController.userData.createdQuestions}, 
                {title: 'Published', score: serverController.userData.publishedQuestions},
                {title: 'Discarded', score: serverController.userData.discardedQuestions}]}/>
            <InfoBlock title="Moderate a Questions" button={{title: 'Moderate', function: onClick[1]}} icounUrl={LoadedImages['Practice.png']}
            text={'Moderate other peoples questions!'} statistics={[
                {title: 'Moderated', score: serverController.userData.moderatedQuestionsCount}, 
                {title: 'Published', score: serverController.userData.publishedQuestionsCount}, 
                {title: 'Discarded', score: serverController.userData.skippedQuestionsCount}]}/>
            {
                serverController.userData.accessLevel === 3?
                <InfoBlock title="Create a pattern" button={{title: 'Create', function: onClick[2]}} icounUrl={LoadedImages['Practice.png']}
                text={'Create a generation pattern!'} statistics={[
                    {title: 'Created', score: 'null'}, ]} />
                : null
            }
    </div>
);


function getSquareStyles() {

    return{
        backgroundColor: clientController.getColorSettingDefault(COLORS.functionalA),
        position: 'relative',
    };
}

const CreatePatternField = ({setData = () => {}}) => {
    const [question, setQuestion] = useState({
        type:0, level: 1, maxPoints: null, pattern: null, data: undefined
    });
    const scrollRef = useRef(undefined);

    const UpdateValue = useCallback((val, state, property) => {
        if(Object.hasOwn(question, property)){
            setQuestion((prev) => {
                let temp = {...prev, [property]: val};
                if(state !== 2) temp = {...prev, [property]: null};
        
                if(property === 'pattern') scrollRef.current.scrollIntoView({behavior: "smooth"});
                
                setData(temp);
                return temp;
            });
        }
    }, [setData]);

    return(
        <div className="IntegrationForm" style={{height: 'calc(6vh * 7)'}}>
            <Switch title={"Type"} callback={(val) => UpdateValue(val, 2, 'type')} current={0}
            values={[
                {val: 0, prev: 'Default', descrip: 'One Answer'}, 
                // {val: 1, prev: 'Several', descrip: 'Several answers'}, 
            ]}
            settings={{title: false, reverse: true}}/>
            <Switch title={"Level"} callback={(val) => UpdateValue(val, 2, 'levle')} current={0}
            values={[
                {val: 1, prev: 'Easy', descrip: 'Easy level', buttonStyles: {backgroundColor: clientController.getColorSetting(2, 'green')}}, 
                {val: 2, prev: 'Middle', descrip: 'Middle level', buttonStyles: {backgroundColor: clientController.getColorSetting(2, 'yellow')}}, 
                {val: 3, prev: 'Hard', descrip: 'Hard level', buttonStyles: {backgroundColor: clientController.getColorSetting(2, 'red')}}]}
            settings={{title: false, reverse: true}}/>
            <InputField defaultValue={"MaxPoints"} typeID={2} min={1} max={4} styles={{left: '5%', width: '90%'}}
            onValueChange={(val, status) => UpdateValue(+val, status, 'maxPoints')}
            contextValidate={(val) => {
                const min_limit = 5;
                const max_limit = 25;

                if(Number.isNaN(+val)) return false;
                if(+val > max_limit || +val < min_limit) {
                    clientController.triggerEvent('show-tip', [`Value must be in range from ${min_limit} to ${max_limit}`, clientController.getColorSetting(2, 'yellow')]);    
                    return false;
                };

                return true;
            }}
            pattern="number"/>
            <InputField styles={{
                left: '5%', width: '90%'
            }}
            defaultValue={'Enter data separated by commas: D1, D2, D3'} max={10000} min={0}
            onValueChange={(val,state) => UpdateValue(val, state,'data')} 
            />
            <InputField defaultValue={"Pattern"} ref={scrollRef} isBigText={true} pattern="longText"
            styles={{
                left: '5%',
                width: '90%',
                height: 'auto',
            }} max={10000} onValueChange={(val, status) => UpdateValue(val, status, 'pattern')}
            />
        </div>
    );
}

const CreateQuestionField = ({}) => {
    const [questType, setQuestType] = useState(0);
    const [questLevel, setQuestLevel] = useState(1);
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

    useEffect(() => {
        clientController.setQuestionBuilderField('type', questType);
        clientController.setQuestionBuilderField('theme', serverController.userData.chosenTheme.id);
        clientController.setQuestionBuilderField('level', questLevel);

        return () => {
            clientController.setQuestionBuilderField('type', null);
            clientController.setQuestionBuilderField('title', null);
            clientController.setQuestionBuilderField('answers', null);
            clientController.setQuestionBuilderField('rightAnswers', null);
            clientController.setQuestionBuilderField('level', null);
        }
    }, [])

    function updateQuestion(title, state){
        setQuestion({
            title,
            state: state === 2,
        });
        clientController.setQuestionBuilderField('title', state === 2? title: null);
    }
    function removeAnswer(id){
        let list = [...answers];
        list = answers.filter(val => val.id !== id);
        
        setAnswers(list);
        if(rightAnswers.includes(id)){
            updateRight(id);
        }
        clientController.setQuestionBuilderField('answers', list);

    }
    function addAnswer(){
        if(answerTitle.state && answers.length < 7){
            let list = [...answers];

            list.push({
                title: answerTitle.title,
                id: `${answerTitle.title}:${list.length}:${new Date().getMilliseconds()}`,
            });
    
            setAnswers(list);
            setAnswerTitle({
                title: '',
                state: false,
            });
            answerTitleClearRef.current();
            clientController.setQuestionBuilderField('answers', list);
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
            clientController.setQuestionBuilderField('rightAnswers', correct);
        }
    }
    function replaceRightAnswers(index){
        let correct = [...rightAnswers];
        const answer = correct[index];
        correct.splice(index, 1);
        correct.splice(index === correct.length? 0: index + 1, 0, answer);

        setRightAnswers(correct);
        clientController.setQuestionBuilderField('rightAnswers', correct);
    }


    return(
        // TODO: Update margins. Maybe should add a padding or smthing like that to root (Modal window)
        <div className="DefaultFont" style={{
            position: 'relative',
            height: '14vh',
            color: clientController.getColorSettingDefault(COLORS.text2),
            textAlign: 'center',
        }}>
            <Switch title={"Type"} callback={(val) => {
                setQuestType(val); 
                setRightAnswers([]);
                clientController.setQuestionBuilderField('rightAnswers', []);
                clientController.setQuestionBuilderField('type', val);
            }} current={questType}
            values={[
                {val: 0, prev: 'Default', descrip: 'One Answer'}, 
                {val: 1, prev: 'Several', descrip: 'Several answers'}, 
                {val: 2, prev: 'Order', descrip: 'Use "__" to indicate answers in question'}]}
            settings={{title: false, reverse: true}}/>
            <Switch title={""} callback={(val) => {
                setQuestLevel(val); 
                clientController.setQuestionBuilderField('level', val);
            }} current={0}
            values={[
                {val: 1, prev: 'Easy', descrip: 'Easy level', buttonStyles: {backgroundColor: clientController.getColorSetting(2, 'green')}}, 
                {val: 2, prev: 'Middle', descrip: 'Middle level', buttonStyles: {backgroundColor: clientController.getColorSetting(2, 'yellow')}}, 
                {val: 3, prev: 'Hard', descrip: 'Hard level', buttonStyles: {backgroundColor: clientController.getColorSetting(2, 'red')}}]}
            settings={{title: false, reverse: true}}/>
            <InputField min={5} max={150} pattern="question" styles={{left: '5%', width: '90%'}} onValueChange={updateQuestion}
            defaultValue={`Create a question. Max 150 symbols.`}/>
            <div className="AnswersList" style={{
                height: '20vh',
                overflowY: 'auto',
                display:'block',
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
                        key={val.id}
                    />
                    
                ))}
                <div style={{
                    display: 'flex',
                    marginTop: '0.5%',
                }}>
                    <InputField defaultValue={'Add an answer.'} max={25} min={1} onValueChange={updateLastAnswer}
                    clearFunctionRef={answerTitleClearRef}
                    pattern="question" styles={{width: '80%', marginBottom: '1%'}} />
                    <DefaultButton text={<PlusIcon />} onClick={addAnswer}
                    styles={{
                        height: '5.5vh',
                        width: '5.5vh',
                        marginLeft: 'auto',
                        ...getSquareStyles()
                    }}>
                    </DefaultButton>
                </div>
            </div>
        </div>
    );
}

const ModerateQuestionField = ({}) => {
    const [question, setQuestion] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [correct, setCorrect] = useState([]);

    useEffect(() => {
        const fetch = async () => {
            let questionsList = [];
            let saved = clientController.getModerating();

            if(saved.length != 0){
                const savedStates = await serverController.checkQuestionsOnModeration(saved.map(val => val.id));
                saved = saved.filter((val, index) => {
                    if(index >= savedStates.length) return false;
                    return savedStates[index];
                });
            }

            if(saved.length < 3) {
                const newest = await serverController.getQuestionsOnModeration(3 - saved.length);
                questionsList = [...saved, ...newest];
            }
            else questionsList = [...saved];
            clientController.saveModerating(questionsList);
            
            TakeQuestion();
        } 
        
        fetch();
    }, []);

    function TakeQuestion(){
        const question = clientController.getNextModerating();
        if(!question) return false;

        const processed = new Question(question);
        setQuestion(processed);
        setAnswers(processed.getData().answers);
        setCorrect(processed.getCorrectAnswersIDs());
    }
    function Process(result){
        serverController.moderate(question.getData().id, result);
        clientController.processModerating();
        TakeQuestion();
    }


    if(!question){
        return null;
    }
    return(
        <div style={{position: 'relative',left: '5%',width: '90%'}}>
            <h3 className="DefaultFont" style={{color: clientController.getColorSettingDefault(COLORS.text)}}>Question</h3>
            <TextPreview text={question.getData().question} textStyles={{textAlign: 'center'}}/>
            <h3 className="DefaultFont" style={{color: clientController.getColorSettingDefault(COLORS.text)}}>Answers</h3>
            <div className="ScrollBar" style={{
                maxHeight: '25vh',
                overflow: 'auto',
                marginBottom: '3%'
            }}>
                {answers.map((val) => (
                    <AnswerBlock val={val} key={val.id} number={correct.indexOf(val.id) + 1}
                    isOrderDisplayed={question.type == 1 && (correct.includes(val.id))}
                    isCorrect={correct.includes(val.id)}/>
                ))}
            </div>
            <div>
                <DefaultButton text="Discard" styles={{position: 'absolute', left: '0'}} onClick={() => { Process(false);}}/>
                <DefaultButton text="Publish" styles={{position: 'absolute', right: '0'}} onClick={() => { Process(true);}}/>
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
            }} onClick={onAnswerClick}/>
            {isOrderDisplayed? 
                <DefaultButton text={number} styles={{
                    height: '3.5vh',
                    width: '3.5vh',
                    marginLeft: 'auto',
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
                    marginLeft: 'auto',
                    ...getSquareStyles()
                }}/>
            :null
            }
        </div>
    );
}