import React, { useEffect, useRef } from "react";

export const UsePreviousState = (state) => {
    const ref = useRef();

    useEffect(() =>{
        ref.current = state;
    }, [state]);

    function set(state){
        ref.current = state;
    }

    return [ref.current, set];
}