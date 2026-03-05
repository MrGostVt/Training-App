import React from "react";
import { ModalWindow } from "./ModalWindow";
import { TextPreview } from "../components/TextPreview";
import { InfoBlock } from "../components/InfoBlock";
import { LoadedImages } from "../application/ImageLoad";
import serverController from "../application/ServerController";



export const ExceptionModal = ({closeCallback = () => {}}) => {
//Something went wrong!
    return(
        <ModalWindow title="" closeCallback={closeCallback} 
        wrapStyles={{
            backgroundColor: 'rgba(0,0,0,0)'
        }}>
            {/* <TextPreview text={'The application is closed for technical work.'} /> */}
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <InfoBlock title="Something went wrong!" 
                text={'The application is closed for technical work.'}
                statistics={[]} icounUrl={LoadedImages['troubleshooting.png']}
                iconHeight={'12vh'} button={{
                    title: 'Try again', function: () => {
                        serverController.init();
                        closeCallback();
                    }
                }}
                />
            </div>
        </ModalWindow>
    );
}