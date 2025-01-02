import React, { useState } from "react";
import NavBarIcon from "../images/NavBar-Icon.png";
import UserIcon from "../images/User-Icon.png";
import { NavLink, useLocation } from "react-router";
import DropDown from "./DropDown.jsx";

export default function NavBar() {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const isAuthPage = (location.pathname === '/signup') || (location.pathname === '/login');

    return (
        <>
            <nav className={`bg-slate-800 text-white shadow-[0_-4px_10px_rgba(0,_0,_0,_0.4)] flex px-2 ${isAuthPage && 'hidden'}`}>
                <span>
                    <img src={NavBarIcon} alt="Icon" className="h-14 m-1" />
                </span>

                <span className="flex items-center text-2xl">
                    <h1>Drum Kit</h1>
                </span>

                <span className="basis-9/12 flex justify-center">
                    <ul className="flex items-center text-lg gap-2">
                        <li>
                            <NavLink to="/" className={({isActive}) => `hover:border-b-[5px] hover:border-blue-800 cursor-pointer p-4 ${isActive ? 'border-b-[5px] border-blue-800' : ''}`}>
                                Home
                            </NavLink>
                        </li>

                        <li>
                            <NavLink to="/recordings" className={({isActive}) => `hover:border-b-[5px] hover:border-blue-800 cursor-pointer py-4 ${isActive ? 'border-b-[5px] border-blue-800' : ''}`}>
                                Recorded Sounds
                            </NavLink>
                        </li>
                    </ul>
                </span>

                <span className="flex-grow flex justify-end items-center">
                    <img src={UserIcon} alt="User" className="h-12 w-12 cursor-pointer" onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}/>
                    <DropDown isOpen={isOpen}/>
                </span>
            </nav>
        </>
    );
}