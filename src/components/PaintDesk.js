import React, {  useEffect, useRef, useState } from "react";
import { UsePreviousState } from "./customHooks/UsePreviousState";
import clientController, { COLORS } from "../application/ClientController";

export const PaintDesk = ({brushSize = 5, brushColor = 'Black'}) => {
    const canvasRef = useRef(undefined);
    const [pixelSize, setPixelSize] = useState(brushSize);
    const [color, setColor] = useState(brushColor);
    const [sizes, setSizes] = useState({width: 0, height: 0});
    const [lastDrawed, setDrawed] = useState({x: 0, y: 0});
    const [previousDrawed, setPrevDraw] = UsePreviousState(lastDrawed);
    const [isMouseRead, setMouseReader] = useState(false);

    useEffect(() => {setColor(brushColor)}, [brushColor]);
    useEffect(() => {setPixelSize(brushSize)}, [brushSize]);

    useEffect((ev) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const ctx = canvas.getContext('2d');
        setSizes({width: rect.width, height: rect.height});
        // const canvasRect = canvas.getBoundingClientRect();
    }, [canvasRef]);

    useEffect(() => {
        const ctx = canvasRef.current.getContext('2d');
        ctx.fillStyle = clientController.getColorData(color);
        console.log(clientController.getColorData(color));
        if(previousDrawed != undefined){
            const xDiff = lastDrawed.x - previousDrawed.x;
            const yDiff = lastDrawed.y - previousDrawed.y;
            const angle = Math.atan2(yDiff, xDiff); //* 180 / Math.PI;

            if(isMouseRead){
                const length = Math.sqrt(xDiff*xDiff + yDiff*yDiff);
                // console.log(`Diffirences: X ${xDiff}; Y: ${yDiff}`);
                for(let j = 0; j < length; j++){
                    const tempX = previousDrawed.x + j * Math.cos(angle);
                    const tempY = previousDrawed.y + j * Math.sin(angle);
                    ctx.beginPath();
                    ctx.arc(tempX , tempY , pixelSize, Math.PI * 2, false);
                    ctx.fill();
                    // ctx.fillRect(tempX - pixelSize/2, tempY - pixelSize/2, pixelSize, pixelSize);
                }
                // ctx.fillStyle = "black"
            }            
        }
        ctx.beginPath();
        ctx.arc(lastDrawed.x , lastDrawed.y , pixelSize, Math.PI * 2, false);
        ctx.fill();
        // ctx.fillRect(lastDrawed.x - pixelSize/2, lastDrawed.y - pixelSize/2, pixelSize, pixelSize);
    }, [lastDrawed]);
    
    function resetPrevDraw(coords){
        const rect = canvasRef.current.getBoundingClientRect();
        const x = coords.clientX - rect.left;
        const y = coords.clientY - rect.top;
        
        setPrevDraw({x,y});
    }

    return(
        <canvas ref={canvasRef} className="PaintDesk" width={sizes.width} height={sizes.height} 
        style={{borderRadius: '15px', backgroundColor: clientController.getColorSettingDefault(COLORS['functionalA'])}}
        
            onClick={(ev) => {
                const rect = canvasRef.current.getBoundingClientRect();
                const x = ev.clientX - rect.left;
                const y = ev.clientY - rect.top;

                setDrawed({x, y});
            }}
            onMouseDown={(ev) => {if(!isMouseRead) setMouseReader(true); resetPrevDraw(ev)}}
            onMouseUp={() => {if(isMouseRead) setMouseReader(false);}}
            onMouseMove={(ev) => {
                if(isMouseRead){    
                    const rect = canvasRef.current.getBoundingClientRect();
                    const x = ev.clientX - rect.left;
                    const y = ev.clientY - rect.top;
                    
                    setDrawed({x,y});
                }
            }}
            onMouseLeave={() => {if(isMouseRead){setMouseReader(false)};}}
            onTouchStart={(ev) => {if(!isMouseRead) setMouseReader(true); resetPrevDraw(ev.targetTouches[0]);}}
            onTouchEnd={() => {if(isMouseRead) setMouseReader(false);}}
            onTouchMove={(ev) => {
                if(isMouseRead){
                    const rect = canvasRef.current.getBoundingClientRect();
                    const x = ev.targetTouches[0].clientX - rect.left;
                    const y = ev.targetTouches[0].clientY - rect.top;
                    setDrawed({x,y});
                }
            }}
        >

        </canvas>
    );
}