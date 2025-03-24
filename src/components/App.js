import React from "react"
import { ProfileCard } from "./ProfileCard"
import { GameCards } from "./GameCards"
import { BottomBlock } from "./BottomBlock"

const App = ({}) => {
    return(
        <div>
            <ProfileCard/>
            <GameCards />
            <BottomBlock />
        </div>
    )
}

export default App;