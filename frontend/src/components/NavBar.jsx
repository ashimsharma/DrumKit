import React from "react";
import NavBarIcon from "../images/NavBar-Icon.png";
import UserIcon from "../images/User-Icon.png";

export default function NavBar() {
    return (
        <>
            <nav className="bg-slate-800 text-white border-b-2 flex px-2">
                <span>
                    <img src={NavBarIcon} alt="Icon" className="h-14 m-1" />
                </span>

                <span className="flex items-center text-2xl">
                    <h1>Drum Kit</h1>
                </span>

                <span className="basis-9/12 flex justify-center">
                    <ul className="flex items-center text-lg gap-6">
                        <li className="hover:text-slate-400 hover:cursor-pointer">Home</li>
                        <li className="hover:text-slate-400 hover:cursor-pointer">Recorded Sounds</li>
                    </ul>
                </span>

                <span className="flex-grow flex justify-end items-center">
                    <img src={UserIcon} alt="User" className="h-10 cursor-pointer" />
                </span>
            </nav>
        </>
    );
}