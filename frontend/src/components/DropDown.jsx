import axios from "axios";
import React, { createContext, useState } from "react";
import PopUp from "./PopUp.jsx";
import { useLocation, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import GuestLogoutAlert from "./GuestLogoutAlert.jsx";

export const DropDownContext = createContext();

export default function DropDown({ isOpen }) {
    const [hovered, setHovered] = useState(false);
    const [show, setShow] = useState(false);
    const [message, setMessage] = useState('');
    const [positive, setPositive] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const isGuest = useSelector(state => state.userType.isGuest);
    const [openGuestAlert, setOpenGuestAlert] = useState(false);

    const logoutUser = async (e) => {
        e.preventDefault();
        setShow(true);
        setMessage('Logging Out...');
        setPositive(true);

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/users/logout-user`,
                {},
                {
                    withCredentials: true
                }
            );

            if (response) {
                navigate("/login");
                setShow(false);
                setMessage('');
                setPositive(true);
            }
        } catch (error) {
            setShow(true);
            setMessage('Logout Failed.');
            setPositive(false);

            setTimeout(() => {
                setShow(false);
                setMessage('');
                setPositive(true);
            })
        }
    }

    const toProfile = (e) => {
        e.preventDefault();
        navigate("/profile", {
            state: {
                from: location.pathname
            }
        });
    }

    return (
        <>
            <DropDownContext.Provider value={{setOpenGuestAlert}}>
                {(isGuest && openGuestAlert) && <GuestLogoutAlert />}
                {show && <PopUp positiveMessage={positive} message={message} />}
                <div
                    className={`${(!isOpen && !hovered) ? "hidden" : ""} absolute right-2 top-12 mt-2 w-48 bg-slate-800 rounded-md text-white ring-2 ring-blue-500`} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
                >
                    <div className="py-1" role="menu" aria-orientation="vertical">
                        <a
                            href="#"
                            className="block px-4 py-2 text-sm hover:bg-gray-100 hover:text-gray-900"
                            role="menuitem"
                            onClick={(e) => toProfile(e)}
                        >
                            Profile
                        </a>
                        <a
                            href="#"
                            className="block px-4 py-2 text-sm hover:bg-gray-100 hover:text-gray-900"
                            role="menuitem"
                            onClick={(e) => {!isGuest ? logoutUser(e) : 
                                e.preventDefault();
                                setOpenGuestAlert(true);
                            }}
                        >
                            Logout
                        </a>
                    </div>
                </div>
            </DropDownContext.Provider>
        </>
    )
}