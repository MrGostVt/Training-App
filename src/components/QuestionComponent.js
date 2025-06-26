import React from "react";
import { Fragment, useRef, useState, useEffect } from "react";
import clientController, { COLORS } from "../application/ClientController";

export const QuestionComponent = ({question, number, qty, answers, theme}) => {
    const [quest, setQuest] = useState(question);
    const [chosenAnswers, setAnswers] = useState(answers);

    let questionText;
    let answerCount;
    if(!!quest){
        questionText = quest.type === 0? 
        quest.question: 
        quest.question.split("__").map((val, id, array) => {
            // console.log(chosenAnswers[id]);
            const answer = question.answers.filter((val) => val.id === chosenAnswers[id])[0];
            let selected = id + 1 !== array.length? `${chosenAnswers[id] !== undefined? answer.title: '-'}`: ''
            // return `${val} ${selected}`
            return(
                <Fragment key={val+id}>
                    <div style={{
                        marginRight: '0.5%',
                        flexShrink: '0',
                    }}>{val}</div>
                    <div style={{
                        backgroundColor: clientController.getColorSettingDefault(COLORS.functional),
                        marginLeft: '0.5%',
                        marginRight: '0.5%',
                        width: '50px',
                        borderRadius: '8px',
                        height: '100%',
                        flexShrink: '0',
                    }}>{selected}</div>
                </Fragment>
            );
        });
    
        answerCount = quest.correctCount;
    }
    else{
        questionText = 'Loading.'
        answerCount = 0;
    }
    
    
    useEffect(() => {
        setQuest(question);
    },[question]);
    useEffect(() => {
        setAnswers(answers);
    }, [answers])
    
    return(
        <div className="DefaultFont Question" style={{color: clientController.getColorSetting(theme, COLORS.text)}}>   
            {`Question ${number}/${qty}. Choose ${answerCount} ${answerCount === 1? 'answer':'answers'}`}
            <div style={{
                fontSize: '16px', 
                textAlign: 'center',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: '3%',
                marginTop: '3%',
            }}>{questionText}</div>
        </div>
    );
}