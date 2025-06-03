import React, { useState } from "react";
import NavBarIcon from "../images/NavBar-Icon.png";
import UserIcon from "../images/User-Icon.png";
import { NavLink, useLocation } from "react-router";
import DropDown from "./DropDown.jsx";
import Hamburger from "./Hamburger.jsx";

export default function NavBar() {
    const [isOpen, setIsOpen] = useState(false);
    const isAuthPage = (location.pathname === '/signup') || (location.pathname === '/login');

    return (
        <>
            <nav className={`bg-slate-800 text-white shadow-[0_-4px_10px_rgba(0,_0,_0,_0.4)] flex items-center lg:items-start px-2 lg:px-[2px] ${isAuthPage && 'hidden'}`}>
                <div className="basis-4/12 lg:basis-0 lg:z-10">
                    <img src={NavBarIcon} alt="Icon" className="h-14 m-2 lg:mx-4 lg:h-12" />
                </div>


                <Hamburger />

                <div className="basis-8/12 flex justify-center lg:hidden gap-7 text-xl">
                    <NavLink to="/" className={({ isActive }) => `hover:border-b-[5px] hover:border-blue-800 py-5 cursor-pointer h-full ${isActive ? 'border-b-[5px] border-blue-800' : ''}`}>
                        Home
                    </NavLink>

                    <NavLink to="/recordings" className={({ isActive }) => `hover:border-b-[5px] hover:border-blue-800 py-5 cursor-pointer h-full ${isActive ? 'border-b-[5px] border-blue-800' : ''}`}>
                        Recorded Sounds
                    </NavLink>
                </div>

                <div className="flex-grow flex justify-end items-center basis-4/12 lg:hidden">
                    <img src={UserIcon} alt="User" className="h-14 w-14 cursor-pointer" onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)} />
                    <DropDown isOpen={isOpen} />
                </div>
            </nav>
        </>
    );
}