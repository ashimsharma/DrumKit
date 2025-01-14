import React, { useState } from "react";
import NavBarIcon from "../images/NavBar-Icon.png";
import UserIcon from "../images/User-Icon.png";
import { NavLink, useLocation } from "react-router";
import DropDown from "./DropDown.jsx";
import Hamburger from "./Hamburger.jsx";

export default function NavBar() {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const isAuthPage = (location.pathname === '/signup') || (location.pathname === '/login');

    return (
        <>
            <nav className={`bg-slate-800 text-white shadow-[0_-4px_10px_rgba(0,_0,_0,_0.4)] flex px-2 lg:p-[2px] ${isAuthPage && 'hidden'}`}>
                <span className="basis-4/12 lg:basis-1/12">
                    <img src={NavBarIcon} alt="Icon" className="h-14 m-2 lg:mx-4 lg:h-12" />
                </span>

                <Hamburger />

                <span className="basis-8/12 flex justify-center lg:hidden">
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

                <span className="flex-grow flex justify-end items-center basis-4/12 lg:hidden">
                    <img src={UserIcon} alt="User" className="h-12 w-12 cursor-pointer" onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}/>
                    <DropDown isOpen={isOpen}/>
                </span>
            </nav>
        </>
    );
}