import React, {useEffect, useState} from "react";
import GithubIcon from "../images/Github-Icon.png";
import LinkedInIcon from "../images/LinkedIn-Icon.png";

export default function Footer(){
    const [currentYear, setCurrentYear] = useState();
    useEffect(() => {
        const date = new Date();
        setCurrentYear(date.getFullYear());
    }, [])

    return (
        <>
            <footer className="text-white text-md p-4 bg-slate-800 flex">
                <span className="grid grid-cols-2 gap-6">
                    <img src={GithubIcon} alt="Github Icon" className="h-6 w-6 invert cursor-pointer hover:shadow-lg transition-shadow duration-300"/>
                    <img src={LinkedInIcon} alt="LinkedIn Icon" className="h-6 w-6 invert cursor-pointer hover:shadow-lg transition-shadow duration-300"/>
                </span>
                <span className="flex-grow">
                    <p className="text-center">&copy; <span>{currentYear}</span> Ashim Sharma. All rights reserved.</p>
                </span>
            </footer>
        </>
    );
}