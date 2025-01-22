import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { MdOutlineClose } from "react-icons/md";
import { DropDownContext } from "./DropDown.jsx";
import PopUp from "./PopUp.jsx";
import axios from "axios";
import { HamburgerContext } from "./Hamburger.jsx";

export default function GuestLogoutAlert() {
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 1023);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const navigate = useNavigate();
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 1023);
    const { setOpenGuestAlert } = !isMobile ? useContext(DropDownContext) : useContext(HamburgerContext);
    const [show, setShow] = useState(false);
    const [message, setMessage] = useState('');
    const [positive, setPositive] = useState(true);

    const logoutGuest = async () => {
        setShow(true);
        setMessage('Logging Out...');
        setPositive(true);

        try {
            const response = await axios.delete(
                `${import.meta.env.VITE_API_URL}/users/logout-guest`,
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

    return (
        <>
            {show && <PopUp positiveMessage={positive} message={message} />}
            <div className={`fixed top-0 left-0 w-full h-full bg-black opacity-50 blur-[8px] z-10`}></div>
            <div className="w-2/5 lg:w-4/5 absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-xl bg-slate-800 text-center brightness-125 z-20 ring-2 ring-blue-500 p-4 text-white">
                <div className="flex justify-end cursor-pointer" onClick={() => setOpenGuestAlert(false)}><MdOutlineClose size={25} /></div>
                <p className="text-center p-2">Logging out would delete all your recordings and data. Register Account to keep your data safe.</p>
                <button className="bg-blue-600 p-2 rounded-lg m-2 hover:bg-blue-800" onClick={() => navigate("/profile/register-guest")}>Register Account</button>
                <button className="bg-blue-600 p-2 rounded-lg m-2 hover:bg-blue-800" onClick={logoutGuest}>Logout Anyway</button>
            </div>
        </>
    )
}