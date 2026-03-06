import React from "react";
import { LoadedImages } from "../application/ImageLoad";

export const LinkBlock = ({}) => {

    return(
        <div className="LinkBlock">
            <Link icon={LoadedImages['github.png']} href={"https://github.com/MrGostVt"}/>
            <Link icon={LoadedImages['flaticon.png']} href={"https://www.flaticon.com"}/>
        </div>
    );
}

const Link = ({icon, href}) => {
    return(
        <a href={href}className="LinkIcon" style={{backgroundImage: `url(${icon})`}}></a>
    );
}