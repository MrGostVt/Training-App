import React from "react";
import { ProfileBlock } from "../components/ProfileBlock";
import { PagePreview } from "../components/PagePreview";
import { ThemesToLearnBlock } from "../components/ThemesToLearnBlock";

export const MainPage = ({}) =>{
    
    return(
        <>
            <PagePreview text="Trainee-App" />
            <ProfileBlock userName={"Alex"} />
            <ThemesToLearnBlock themesList={[{themeName: 'Math', points: 100, id: 0,},
                {themeName: 'English', points: 50, id: 1,},
                {themeName: '...', points: 0, id: 2,}]}/>
        </>
    );
}