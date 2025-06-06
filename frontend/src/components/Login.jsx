import React, { useState, useEffect } from "react";
import DrumKitImage from "../images/DrumKit-Image.jpg";
import Drum from "../images/NavBar-Icon.png";
import { useNavigate } from "react-router";
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { IoIosCloseCircle } from "react-icons/io";
import { useForm } from "react-hook-form";
import TypeAnimation from "./TypeAnimation.jsx";
import PopUp from "./PopUp.jsx";
import axios from "axios";
import Loader from "./Loader.jsx";
import { refreshAccessToken, checkIfAuthenticated } from "../utils/index.js";

export default function Login() {
    const navigate = useNavigate();
    const [passwordVisible, setPasswordVisible] = useState(false);
    const { register, handleSubmit, formState: { errors }, reset } = useForm({ mode: "onChange" });
    const [error, setError] = useState(false);
    const [message, setMessage] = useState('Logging In...');
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(true);
    const [emailVerified, setEmailVerified] = useState(true);

    useEffect(() => {
        (async () => {
            const isAuthenticated = await checkIfAuthenticated();
            if (isAuthenticated) {
                navigate("/")
            }
            else {
                const accessTokenRefresh = await refreshAccessToken();

                if (accessTokenRefresh) {
                    navigate("/");
                    setLoading(false);
                }
            }
            setLoading(false);
        }
        )();
    }, []);

    const togglePasswordVisibility = () => {
        setPasswordVisible((prev) => !prev);
    };

    const navigateToSignup = () => {
        navigate('/signup')
    };

    const loginUser = async (data) => {
        reset();
        setShow(true);
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/users/login`,
                data,
                {
                    withCredentials: true
                }
            )

            if (response) {
                setMessage(response.data.message);
                setError(false);
            }

            setTimeout(() => {
                setShow(false);
                setMessage('Logging In...');
                navigate('/');
            }, 1000);
        } catch (error) {
            setMessage(error.response?.data.message || 'Failed to connect to server. Try Again Later.');
            if (error.response?.data.message === "Email not verified yet. Verify Email to Login.") {
                setEmailVerified(false);
            }
            setError(true);
            setTimeout(() => {
                setError(false);
                setShow(false);
                setMessage('Logging In...');
            }, 3000);
        }
    }

    const loginGuest = async () => {
        setShow(true);
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/users/register-guest`,
                {},
                {
                    withCredentials: true
                }
            )

            if (response) {
                setMessage(response.data.message);
                setError(false);
            }

            setTimeout(() => {
                setShow(false);
                setMessage('Logging In...');
                setError(false);
                navigate('/');
            }, 1500);
        } catch (error) {
            setMessage(error.response?.data.message || 'Failed to connect to server. Try Again Later.');
            setError(true);
            setTimeout(() => {
                setError(false)
                setShow(false);
                setMessage('Logging In...');
            }, 1500);
        }
    }

    return (
        loading ? <Loader /> :
            <>
                <h1 className="absolute top-48 left-24 text-white font-bold text-[3.5rem] lg:hidden z-10">
                    Drum Kit 🥁<TypeAnimation textSequence={['Create and Enjoy the soothing sounds', 5000, 'Login to Continue']} />
                </h1>

                {show && <PopUp positiveMessage={!error} message={message} />}

                <div className="grid grid-cols-2 bg-slate min-h-screen lg:block m-0 h-full min-w-screen w-full">
                    <div className="lg:hidden">
                        <div className="absolute bg-gray-800 w-1/2 h-full blur-3xl opacity-70 lg:hidden"></div>
                        <img src={DrumKitImage} alt="Drum kit Image" className="w-full h-full" />
                    </div>
                    <div className="bg-slate-800 w-full h-full">
                        <div className="flex flex-row justify-end p-4 lg:justify-start">
                            <img src={Drum} alt="Drum Logo" className="h-16" />
                        </div>
                        <div className="p-8 lg:p-16">
                            <h1 className="text-center text-white text-4xl font-bold py-8">Login</h1>
                            <form action="" onSubmit={handleSubmit(loginUser)}>
                                <input type="text" placeholder="Enter Your Email" className="bg-transparent border border-slate-400/50 rounded-lg px-4 py-2 w-full text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-500 backdrop-blur-sm my-4" {...register("email", { required: "All fields are required.", pattern: { value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: "Email in wrong format." } })} />
                                <div className="relative">
                                    <input
                                        type={passwordVisible ? 'text' : 'password'}
                                        placeholder="Enter your password"
                                        className="bg-transparent border border-slate-400/50 rounded-lg px-4 py-2 w-full text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-500 backdrop-blur-sm pr-10" {...register("password", { required: "All fields are required.", minLength: { value: 8, message: "Password must be 8 characters long." }, maxLength: { value: 15, message: "Too long Password." } })} />
                                    <p className="text-red-600 text-sm w-full h-3 my-2">{(errors.email || errors.password) && (errors.email?.message || errors.password?.message)}</p>
                                    <button
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        className="absolute top-1/3 right-3 transform -translate-y-1/2 text-white"
                                    >
                                        {passwordVisible ? (
                                            <AiFillEyeInvisible size={20} />
                                        ) : (
                                            <AiFillEye size={20} />
                                        )}
                                    </button>
                                </div>
                                <div className="lg:text-center">
                                    <button type="button" className="bg-none underline text-blue-700" onClick={() => navigate('/forgot-password-email-input', {
                                        state: {
                                            from: location.pathname
                                        }
                                    })}>Forgot Password?</button>
                                </div>
                                <input type="submit" value="Submit" className="w-full bg-blue-600 p-2 my-4 rounded-lg text-white hover:bg-blue-800 cursor-pointer" />
                            </form>

                            <h2 className="my-2 text-white text-center">OR</h2>
                            <div className="text-center">
                                <button className="bg-emerald-500 hover:bg-emerald-700 p-2 rounded-lg text-white cursor-pointer w-3/4 mt-2" onClick={loginGuest}>Login as guest</button>
                            </div>
                            {!emailVerified && <div className="bg-blue-100/10 rounded-lg border-2 border-blue-600 mt-4 flex">
                                <p className="text-white text-center p-4 basis-4/5">The Email you are trying to login with is not verified! <button className="bg-none underline text-blue-700" onClick={() => navigate("/input-email", {
                                    state: {
                                        from: location.pathname
                                    }
                                })}>Verify Email Now</button></p>
                                <div className="flex justify-end basis-1/5 p-2 hover:cursor-pointer" onClick={() => setEmailVerified(true)}>
                                    <IoIosCloseCircle size={20} color="gray"/>
                                </div>
                            </div>}
                            <p className="text-white text-center p-4 mt-10">Dont't have an account? <button className="bg-none underline text-blue-700" onClick={navigateToSignup}>Create One</button></p>
                        </div>
                    </div>
                </div>
            </>
    )
}