import axios from "axios";
import { useEffect, useState } from "react";
import { IoChevronBackCircleSharp } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router";
import PopUp from "./PopUp.jsx";
import Loader from "./Loader.jsx";

export default function VerifyEmail() {
    const [otp, setOtp] = useState(new Array(6).fill(""));
    const navigate = useNavigate();
    const [showNotification, setShowNotification] = useState({ show: false, positiveMessage: true, message: '' });
    const [loading, setLoading] = useState(true);
    const prevLocation = useLocation().state?.from;

    useEffect(() => {
        (
            () => {
                if(!prevLocation){
                    navigate("/login");
                    return;
                }
                setLoading(false);
            }
        )();
    })
    const handleChange = (e, index) => {
        const value = e.target.value;
        if (isNaN(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);

        if (value && index < otp.length - 1) {
            document.getElementById(`otp-input-${index + 1}`).focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            document.getElementById(`otp-input-${index - 1}`).focus();
        }
    };

    const handleSubmit = async (e) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/users/verify-email`,
                {
                    otp: otp.join("")
                },
                {
                    withCredentials: true
                }
            )

            if (response) {
                navigate("/login");
            }
        } catch (error) {
            if (!error.response?.data) {
                navigate("/login");
                return;
            }

            setShowNotification({ show: true, positiveMessage: false, message: error.response?.data.message });
            setTimeout(() => {
                setShowNotification({ show: false, positiveMessage: true, message: '' });
            }, 3000);
        }
    };

    const requestOTP = async () => {
        try {
            setShowNotification({ show: true, positiveMessage: true, message: 'Requesting for OTP...' });
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/users/resend-otp`,
                {},
                {
                    withCredentials: true
                }
            )

            if (response) {
                setShowNotification({ show: true, positiveMessage: true, message: response.data.message });
                setTimeout(() => {
                    setShowNotification({ show: false, positiveMessage: true, message: '' });
                }, 3000);
            }
        } catch (error) {
            if (!error.response?.data) {
                navigate("/login");
                return;
            }

            setShowNotification({ show: true, positiveMessage: false, message: error.response?.data.message });
            setTimeout(() => {
                setShowNotification({ show: false, positiveMessage: true, message: '' });
            }, 3000);
        }
    }

    const backClick = () => {
        navigate("/signup");
    }

    if(loading){
        return <Loader />
    }
    return (
        <>
            {showNotification.show && <PopUp message={showNotification.message} positiveMessage={showNotification.positiveMessage} />}
            <div className="bg-gray-900 text-white p-4">
                <div className="inline-flex text-gray-400 hover:text-gray-600 items-center cursor-pointer" onClick={backClick}>
                    <IoChevronBackCircleSharp size={40} />
                    <p className="p-2 text-xl">Back</p>
                </div>
                <div className="flex flex-col items-center min-h-screen">
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96 text-center">
                        <h2 className="text-2xl font-semibold mb-4">Verify Email</h2>
                        <p className="text-white mb-4">Enter the 6-digit OTP sent to your email.</p>
                        <div className="flex justify-center gap-3 mb-4 text-black">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    id={`otp-input-${index}`}
                                    type="text"
                                    value={digit}
                                    maxLength={1}
                                    onChange={(e) => handleChange(e, index)}
                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                    className="w-12 h-12 text-center text-xl border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            ))}
                        </div>
                        <button
                            onClick={(e) => handleSubmit(e)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-800 w-full"
                        >
                            Verify OTP
                        </button>
                        <button className="bg-none underline text-blue-700 mt-2" onClick={requestOTP}>Resend OTP?</button>
                    </div>
                </div>
            </div>
        </>
    );
}
