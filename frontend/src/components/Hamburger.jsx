import React, { createContext, useState } from "react";
import { useNavigate } from "react-router";
import PopUp from "./PopUp.jsx";
import axios from "axios";
import { useSelector } from "react-redux";
import GuestLogoutAlert from "./GuestLogoutAlert.jsx";

export const HamburgerContext = createContext();

export default function Hamburger() {
    const [isOpen, setIsOpen] = useState(false);
    const [show, setShow] = useState(false);
    const [message, setMessage] = useState('');
    const [positive, setPositive] = useState(true);
    const navigate = useNavigate();
    const isGuest = useSelector(state => state.userType.isGuest);
    const [openGuestAlert, setOpenGuestAlert] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

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

            console.log(response);

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
            console.log(error);
            setTimeout(() => {
                setShow(false);
                setMessage('');
                setPositive(true);
            }, 1500)
        }
    }

    return (
        <>
            <HamburgerContext.Provider value={{ setOpenGuestAlert }}>
                {show && <PopUp positiveMessage={positive} message={message} />}
                {(isGuest && openGuestAlert) && <GuestLogoutAlert />}
                <div className="lg:flex lg:flex-col basis-full mx-2 my-3 hidden">
                    <div className="lg:justify-end lg:items-center lg:flex lg:flex-grow p-2">
                        <button
                            onClick={toggleMenu}
                            className="flex flex-col space-y-1.5 hamburger-menu"
                        >
                            <span
                                className={`block w-6 h-0.5 bg-white transition-transform duration-300 ${isOpen ? "rotate-45 translate-y-2" : ""
                                    }`}
                            ></span>
                            <span
                                className={`block w-6 h-0.5 bg-white transition-opacity duration-300 ${isOpen ? "opacity-0" : ""
                                    }`}
                            ></span>
                            <span
                                className={`block w-6 h-0.5 bg-white transition-transform duration-300 ${isOpen ? "-rotate-45 -translate-y-2" : ""
                                    }`}
                            ></span>
                        </button>
                    </div>

                    {/* Dropdown Menu */}
                    <div
                        className={`bg-slate-800 text-center overflow-hidden transition-max-height duration-300 ease-in-out ${isOpen ? "max-h-40" : "max-h-0"
                            }`}
                    >
                        <ul className="p-4 space-y-2">
                            <li>
                                <a href="#" className="block text-white hover:bg-gray-100 hover:text-gray-900" onClick={(e) => {
                                    e.preventDefault();
                                    navigate("/");
                                }}>
                                    Home
                                </a>
                            </li>
                            <li>
                                <a href="#" className="block text-white hover:bg-gray-100 hover:text-gray-900" onClick={(e) => {
                                    e.preventDefault();
                                    navigate("/recordings");
                                }}>
                                    Recordings
                                </a>
                            </li>
                            <li>
                                <a href="#" className="block text-white hover:bg-gray-100 hover:text-gray-900" onClick={(e) => {
                                    e.preventDefault();
                                    navigate("/profile");
                                }}>
                                    Profile
                                </a>
                            </li>
                            <li>
                                <a className="block text-white hover:bg-gray-100 hover:text-gray-900 cursor-pointer" onClick={!isGuest ? logoutUser : (e) => {
                                    e.preventDefault();
                                    setOpenGuestAlert(true);
                                }}>
                                    Logout
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </HamburgerContext.Provider>
        </>
    );
}
