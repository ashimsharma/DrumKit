import React, { useEffect, useState } from "react";
import GithubIcon from "../images/Github-Icon.png";
import LinkedInIcon from "../images/LinkedIn-Icon.png";
import { Link } from "react-router";

export default function Footer() {
    const [currentYear, setCurrentYear] = useState();
    useEffect(() => {
        const date = new Date();
        setCurrentYear(date.getFullYear());
    }, [])

    return (
        <>
            <footer className="text-white text-md p-4 bg-slate-800 flex shadow-[0_-4px_10px_rgba(0,_0,_0,_0.4)]">
                <span className="grid grid-cols-2 gap-6">
                    <Link to="https://github.com/ashimsharma" target="_blank">
                        <img src={GithubIcon} alt="Github Icon" className="h-6 w-6 invert cursor-pointer hover:shadow-lg transition-shadow duration-300" />
                    </Link>

                    <Link to="https://linkedin.com/in/ashim-sharma7" target="_blank">
                        <img src={LinkedInIcon} alt="LinkedIn Icon" className="h-6 w-6 invert cursor-pointer hover:shadow-lg transition-shadow duration-300" />
                    </Link>
                </span>
                <span className="flex-grow">
                    <p className="text-center">&copy; <span>{currentYear}</span> Ashim Sharma. All rights reserved.</p>
                </span>
            </footer>
        </>
    );
}