import React from "react";
import { useState } from "react";

export const PagePreview = ({text = "text"}) => {
    const [isBackButton, setBackButton] = useState(false);

    return(
        <div className="PagePreview DefaultFont">{text}</div>
    );
}