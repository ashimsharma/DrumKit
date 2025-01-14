import React, { useEffect, useState } from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import LinkedInIcon from "../images/LinkedIn-Icon.png";
import { Link } from "react-router";
import { useLocation } from "react-router";

export default function Footer() {
    const [currentYear, setCurrentYear] = useState();
    const location = useLocation();
    const isAuthPage = (location.pathname === '/signup') || (location.pathname === '/login');

    useEffect(() => {
        const date = new Date();
        setCurrentYear(date.getFullYear());
    }, [])

    return (
        <>
            <footer className={`text-white text-md p-4 bg-slate-800 flex shadow-[0_-4px_10px_rgba(0,_0,_0,_0.4)] ${isAuthPage && 'hidden'}`}>
                <span className="grid grid-cols-2 gap-6 lg:gap-2">
                    <Link to="https://github.com/ashimsharma" target="_blank">
                        <div className="text-gray-400 text-3xl lg:text-2xl cursor-pointer hover:text-gray-600">
                            <FaGithub />
                        </div>
                    </Link>

                    <Link to="https://linkedin.com/in/ashim-sharma7" target="_blank">
                        <div className="text-gray-400 text-3xl lg:text-2xl cursor-pointer hover:text-gray-600">
                            <FaLinkedin />
                        </div>
                    </Link>
                </span>
                <span className="flex-grow lg:text-sm">
                    <p className="text-center">&copy; <span>{currentYear}</span> Ashim Sharma. All rights reserved.</p>
                </span>
            </footer>
        </>
    );
}