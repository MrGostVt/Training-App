import React, { useState } from "react"
import './assets/styles/App.css'
import { MainPage } from "./pages/MainPage";


const App = ({}) => {
    const [pageId, setPage] = useState(0);

    let page;
    switch(pageId){
        
        case 0: page = <MainPage />
    }

    return(
        <div className="App">
            {page}
        </div>
    )
}

export default App;