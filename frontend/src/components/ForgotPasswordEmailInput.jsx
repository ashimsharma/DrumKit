import React, { useState, useEffect } from "react";
import Loader from "./Loader";
import { useLocation, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { IoChevronBackCircleSharp } from "react-icons/io5";
import PopUp from "./PopUp";
import axios from "axios";

export default function ForgotPasswordEmailInput() {
    const navigate = useNavigate();
    const [error, setError] = useState(false);
    const [message, setMessage] = useState('Requesting for Verification OTP...');
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(true);
    const { register, handleSubmit, formState: { errors }, reset } = useForm({ mode: "onChange" });
    const prevLocation = useLocation().state?.from;

    useEffect(() => {
        (
            () => {
                if (!prevLocation) {
                    navigate("/login");
                    return;
                }
                setLoading(false);
            }
        )();
    });

    const backClick = () => {
        if (!prevLocation) {
            navigate("/");
            return;
        }
        navigate(prevLocation);
    }

    const sendEmail = async (data) => {
        reset();
        setShow(true);
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/users/forgot-password-send-email`,
                data,
                {
                    withCredentials: true
                }
            )

            if (response) {
                navigate("/verify-email", {
                    state: {
                        from: location.pathname
                    }
                });
            }
        } catch (error) {
            setMessage(error.response?.data.message || 'Failed to connect to server. Try Again Later.');
            setError(true);
            setTimeout(() => {
                setError(false);
                setShow(false);
                setMessage('Requesting for Verification OTP...');
            }, 1500);
        }
    }
    return (
        loading ? <Loader /> :
            <>
                {show && <PopUp positiveMessage={!error} message={message} />}

                <div className="bg-gray-900 min-h-screen lg:block m-0 h-full min-w-screen w-full p-4">
                    <div className="inline-flex text-gray-400 hover:text-gray-600 items-center cursor-pointer" onClick={backClick}>
                        <IoChevronBackCircleSharp size={40} />
                        <p className="p-2 text-xl">Back</p>
                    </div>

                    <div className="w-full h-full">
                        <div className="w-1/2 lg:w-3/4 m-auto">
                            <h1 className="text-center text-white text-3xl font-bold py-8">Enter Email for Verification OTP</h1>
                            <form action="" onSubmit={handleSubmit(sendEmail)}>
                                <input type="text" placeholder="Email" className="bg-transparent border border-slate-400/50 rounded-lg px-4 py-2 w-full text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-500 backdrop-blur-sm col-span-2" {...register("email", { required: "Email is required.", pattern: { value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: "Email in wrong format." } })} />
                                <p className="text-red-600 text-sm w-full h-3 my-2">{(errors.email || errors.password) && (errors.email?.message || errors.password?.message)}</p>
                                <input type="submit" value="Submit" className="w-full bg-blue-600 p-2 my-4 rounded-lg text-white hover:bg-blue-800 cursor-pointer col-span-2" />
                            </form>
                        </div>
                    </div>
                </div>
            </>
    )
}