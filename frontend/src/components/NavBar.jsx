import React, { useState } from "react";
import NavBarIcon from "../images/NavBar-Icon.png";
import UserIcon from "../images/User-Icon.png";
import { NavLink } from "react-router";
import DropDown from "./DropDown.jsx";

export default function NavBar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <nav className="bg-slate-800 text-white shadow-[0_-4px_10px_rgba(0,_0,_0,_0.4)] flex px-2">
                <span>
                    <img src={NavBarIcon} alt="Icon" className="h-14 m-1" />
                </span>

                <span className="flex items-center text-2xl">
                    <h1>Drum Kit</h1>
                </span>

                <span className="basis-9/12 flex justify-center">
                    <ul className="flex items-center text-lg gap-6">
                        <li>
                            <NavLink to="/" className={({isActive}) => `hover:text-slate-300 hover:underline cursor-pointer ${isActive ? 'text-slate-200 underline' : ''}`}>
                                Home
                            </NavLink>
                        </li>

                        <li>
                            <NavLink to="/recordings" className={({isActive}) => `hover:text-slate-200 hover:underline cursor-pointer ${isActive ? 'text-slate-300 underline' : ''}`}>
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