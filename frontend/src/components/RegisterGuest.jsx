import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { IoChevronBackCircleSharp } from "react-icons/io5";
import { useForm } from "react-hook-form";
import axios from "axios";
import PopUp from "./PopUp.jsx";
import Loader from "./Loader.jsx";
import { useLocation } from "react-router";

export default function RegisterGuest() {
    const prevLocation = useLocation().state?.from;
    const navigate = useNavigate();
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [error, setError] = useState(false);
    const [message, setMessage] = useState('Creating Account...');
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            const isAuthenticated = await checkIfAuthenticated();
            if (isAuthenticated) {
                setLoading(false);
            }
        }
        )();
    }, []);

    const { register, handleSubmit, formState: { errors }, reset } = useForm({ mode: "onChange" });

    const togglePasswordVisibility = () => {
        setPasswordVisible((prev) => !prev);
    };

    const registerGuestUser = async (data) => {
        reset();
        setShow(true);
        setLoading(true);
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/users/register-guest`,
                data,
                { withCredentials: true }
            );

            if (response) {
                setMessage(response.data.message);
                setError(false);
            }

            setTimeout(() => {
                setShow(false);
                setMessage('Creating Account...');
                navigate('/');
            }, 1500);

        } catch (error) {
            setMessage(error.response?.data.message || 'Failed to connect to server. Try Again Later.');
            setError(true);
            setTimeout(() => {
                setShow(false);
                setMessage('Creating Account...');
            }, 3000);
        } finally {
            setLoading(false);
        }
    };

    const checkIfAuthenticated = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/users/check-auth`,
                {
                    withCredentials: true
                }
            )

            if(response){
                return true;
            } else{
                return false;
            }
        } catch (error) {
            navigate("/login");
            return false;
        }
    }

    const backClick = () => {
        if (!prevLocation) {
            navigate("/");
            return;
        }
        navigate(prevLocation);
    }

    return (
        loading ? <Loader /> :
            <>
                {show && <PopUp positiveMessage={!error} message={message} />}
                <div className="bg-gray-900 min-h-screen p-4">
                    <div className="inline-flex text-gray-400 hover:text-gray-600 items-center cursor-pointer" onClick={backClick}>
                        <IoChevronBackCircleSharp size={40} />
                        <p className="p-2 text-xl">Back</p>
                    </div>

                    <div className="grid grid-cols-1 bg-slate min-h-screen m-0 h-full min-w-screen w-full">
                        <div className="bg-slate-800 w-1/3 m-auto h-3/4 flex items-center justify-center lg:w-full lg:h-4/5 rounded-xl">
                            <div className="p-8 w-full max-w-md">
                                <h1 className="text-center text-white text-4xl font-bold py-4">Register your Account</h1>
                                <form action="" onSubmit={handleSubmit(registerGuestUser)} className="grid gap-4">
                                    <input type="text" placeholder="First Name" className="bg-transparent border border-slate-400/50 rounded-lg px-4 py-2 w-full text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-500 backdrop-blur-sm" {...register("firstname", { required: "All fields are required.", pattern: { value: /^[a-zA-Z0-9][a-zA-Z0-9'-]{0,49}$/, message: "Firstname in wrong format." } })} />

                                    <input type="text" placeholder="Last Name" className="bg-transparent border border-slate-400/50 rounded-lg px-4 py-2 w-full text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-500 backdrop-blur-sm" {...register("lastname", { required: "All fields are required.", pattern: { value: /^[a-zA-Z0-9][a-zA-Z0-9'-]{0,49}$/, message: "Lastname in wrong format." } })} />

                                    <input type="text" placeholder="Email" className="bg-transparent border border-slate-400/50 rounded-lg px-4 py-2 w-full text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-500 backdrop-blur-sm" {...register("email", { required: "All fields are required.", pattern: { value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: "Email in wrong format." } })} />

                                    <div className="relative">
                                        <input
                                            type={passwordVisible ? 'text' : 'password'}
                                            placeholder="Password"
                                            className="bg-transparent border border-slate-400/50 rounded-lg px-4 py-2 w-full text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-500 backdrop-blur-sm pr-10" {...register("password", { required: "All fields are required.", minLength: { value: 8, message: "Password must be 8 characters long." }, maxLength: { value: 15, message: "Too long Password." } })} />
                                        <button
                                            type="button"
                                            onClick={togglePasswordVisibility}
                                            className="absolute top-5 right-3 transform -translate-y-1/2 text-white"
                                        >
                                            {passwordVisible ? (
                                                <AiFillEyeInvisible size={20} />
                                            ) : (
                                                <AiFillEye size={20} />
                                            )}
                                        </button>
                                    </div>
                                    <p className="text-red-600 text-sm w-full h-3 my-2">{(errors.email || errors.password || errors.firstname || errors.lastname) && (errors.email?.message || errors.password?.message || errors.firstname?.message || errors.lastname?.message)}</p>

                                    <input type="submit" value="Submit" className="w-full bg-blue-600 p-2 rounded-lg text-white hover:bg-blue-800 cursor-pointer" />
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </>
    );
}