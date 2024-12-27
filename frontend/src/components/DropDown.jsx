import React, { useState } from "react";

export default function DropDown({isOpen}) {
    const [hovered, setHovered] = useState(false);

    return (
        <div
            className={`${(!isOpen && !hovered) ? "hidden" : "" } absolute right-2 top-12 mt-2 w-48 bg-slate-800 rounded-md text-white ring-2 ring-blue-500`} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
        >
            <div className="py-1" role="menu" aria-orientation="vertical">
                <a
                    href="#"
                    className="block px-4 py-2 text-sm hover:bg-gray-100 hover:text-gray-900"
                    role="menuitem"
                >
                    Profile
                </a>
                <a
                    href="#"
                    className="block px-4 py-2 text-sm hover:bg-gray-100 hover:text-gray-900"
                    role="menuitem"
                >
                    Logout
                </a>
            </div>
        </div>
    )
}