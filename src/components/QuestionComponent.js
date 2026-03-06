import React, { useMemo } from "react";
import { Fragment, useRef, useState, useEffect } from "react";
import clientController, { COLORS } from "../application/ClientController";
import { TextPreview } from "./TextPreview";

const selectedStyles = {
    backgroundColor: clientController.getColorSettingDefault(COLORS.functionalA),
    marginLeft: '0.5%',
    marginRight: '0.5%',
    width: 'auto',
    minWidth: '50px',
    borderRadius: '8px',
    height: '100%',
    flexShrink: '0',
    display: 'inline-block'
};

export const QuestionComponent = ({question, number, qty, answers, theme}) => {
    const [quest, setQuest] = useState(null);
    const [chosenAnswers, setAnswers] = useState(answers);
    const [answerCount, setAnswerCount] = useState(0);


    const questionText = useMemo(() => {
        if(!!quest && quest.type === 1){
            const textComponents = quest.question.split("__");
            return textComponents.map((val, id, array) => {
                const answer = quest.answers.find(answer => answer.id === chosenAnswers[id]);

                let selected = id + 1 !== array.length
                ? `${chosenAnswers[id] !== undefined? answer.title: '-'}`
                : '';
    
                const element = selected.length > 0
                ? <span style={selectedStyles}>{selected}</span>
                : null;

                return(
                    <Fragment key={val+id}>
                        <span style={{
                            marginRight: '0.5%',
                            flexShrink: '0',
                        }}>{val}</span>
                        {element}
                    </Fragment>
                );
            });
        }
        return (quest && !quest.question) || !quest? 'Loading...': quest.question;
            
    }, [quest, chosenAnswers, qty, number]);

    
    
    useEffect(() => {
        const clone = {...question};
        setQuest(clone);
        setAnswerCount(clone.correctCount);
    },[question]);
    useEffect(() => {
        setAnswers([...answers]);
    }, [answers])
    useEffect(() => {
        clientController.store['currentQuestion'] = questionText;
    }, [questionText]);
    
    return(
        <div className="DefaultFont Question" style={{
            color: clientController.getColorSetting(theme, COLORS.text),
            backgroundColor: clientController.getColorSetting(theme, COLORS.back)
            }}>   
            <p className="QuestionInfoPreview">{`Question ${number}/${qty}. Choose ${answerCount} ${answerCount === 1? 'answer':'answers'}`}</p>
            <TextPreview text={questionText} wrapStyles={{
                width: 'auto', height: 'auto', margin: 0,
                backgroundColor: clientController.getColorSettingDefault(COLORS.functional),
                }} 
                highlightMath={quest && quest.type === 0} hightlightColor={clientController.getColorSettingDefault(COLORS.textA)}
                textStyles={{display: 'flex', flexDirection: 'row', justifyContent: 'center', textAlign: 'center', 
                color: clientController.getColorSettingDefault(COLORS.text3),
            }}/>
        </div>
    );
}