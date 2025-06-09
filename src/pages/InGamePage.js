import React from "react";
import { DefaultButton } from "../components/DefaultButton";
import '../assets/styles/InGame.css'

export const InGamePage = ({}) => {

    return(
        <>
            <Question question={'What is the capital of france?'} number={3} qty={5}/>
            <Answers answers={[{title: "Paris", id: 0}, {title: "Ierusalim", id: 1}, {title: "Zhytomyr", id: 2}, {title: "Kyiv", id: 3}]} />
            
            <DefaultButton styles={{bottom: '5%', width: '90%', left: '5%', backgroundColor: `var(--main-button-dark-color)`}}/>
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

const Answers = ({answers = [{title, id}], onClick = () => {}}) => {
    
    return(
        <div className="AnswersList">
            {answers.map((val) => (
                <DefaultButton text={val.title} key={val.id} styles={{position: 'relative', marginBottom: '5%', width: '100%'}}/>
            ))}
        </div>
    );
}