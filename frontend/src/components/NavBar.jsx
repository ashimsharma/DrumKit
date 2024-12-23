import React from "react";

export default function NavBar(){
    return (
        <>
            <nav className="bg-slate-900 text-white p-4 border-b-2">
                <span>
                    <img src="../assets/NavBar-Icon.png" alt="Icon" className="display-inline"/>
                    <span>
                        <h1>Drum Kit</h1>
                    </span>
                </span>
                <span></span>
            </nav>
        </>
    );
}