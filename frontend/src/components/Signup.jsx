import React, { useState, useEffect } from "react";
import DrumKitImage from "../images/DrumKit-Image.jpg";
import Drum from "../images/NavBar-Icon.png";
import { useNavigate } from "react-router";
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { useForm } from "react-hook-form";
import TypeAnimation from "./TypeAnimation.jsx";
import axios from "axios";
import PopUp from "./PopUp.jsx";
import Loader from "./Loader.jsx";
import { refreshAccessToken, checkIfAuthenticated } from "../../utils/index.js";

export default function Login() {
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

    const { register, handleSubmit, formState: { errors }, reset } = useForm({ mode: "onChange" });

    const togglePasswordVisibility = () => {
        setPasswordVisible((prev) => !prev);
    };

    const navigateToLogin = () => {
        navigate('/login')
    };

    const signupUser = async (data) => {
        reset();
        setShow(true);
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/users/signup`,
                data
            )

            if (response) {
                setMessage(response.data.message);
                setError(false);
            }

            setTimeout(() => {
                setShow(false);
                setMessage('Creating Account...');
                navigate('/login');
            }, 1500);

        } catch (error) {
            setMessage(error.response?.data.message || 'Failed to connect to server. Try Again Later.');
            setError(true);
            setTimeout(() => {
                setShow(false);
                setMessage('Creating Account...');
            }, 3000);
        }
    }
    return (
        loading ? <Loader /> :
            <>
                <h1 className="absolute top-48 right-24 w-[590px] text-white font-bold text-[3.5rem] lg:hidden z-10">
                    Drum Kit 🥁 <TypeAnimation textSequence={['Create and Enjoy the soothing sounds', 5000, 'Create Account to Continue']} />
                </h1>

                {show && <PopUp positiveMessage={!error} message={message} />}

                <div className="grid grid-cols-2 bg-slate min-h-screen lg:block m-0 h-full min-w-screen w-full">
                    <div className="bg-slate-800 w-full h-full">
                        <div className="flex flex-row justify-start p-4 lg:justify-start">
                            <img src={Drum} alt="Drum Logo" className="h-16" />
                        </div>
                        <div className="p-14 lg:p-16">
                            <h1 className="text-center text-white text-4xl font-bold py-8">Create an Account</h1>
                            <form action="" onSubmit={handleSubmit(signupUser)} className="grid grid-cols-2 gap-3">
                                <input type="text" placeholder="First Name" className="bg-transparent border border-slate-400/50 rounded-lg px-4 py-2 w-full text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-500 backdrop-blur-sm" {...register("firstname", { required: "All fields are required.", pattern: { value: /^[a-zA-Z0-9][a-zA-Z0-9'-]{0,49}$/, message: "Firstname in wrong format." } })} />

                                <input type="text" placeholder="Last Name" className="bg-transparent border border-slate-400/50 rounded-lg px-4 py-2 w-full text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-500 backdrop-blur-sm" {...register("lastname", { required: "All fields are required.", pattern: { value: /^[a-zA-Z0-9][a-zA-Z0-9'-]{0,49}$/, message: "Lastname in wrong format." } })} />

                                <input type="text" placeholder="Email" className="bg-transparent border border-slate-400/50 rounded-lg px-4 py-2 w-full text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-500 backdrop-blur-sm col-span-2" {...register("email", { required: "All fields are required.", pattern: { value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: "Email in wrong format." } })} />

                                <div className="relative col-span-2">
                                    <input
                                        type={passwordVisible ? 'text' : 'password'}
                                        placeholder="Password"
                                        className="bg-transparent border border-slate-400/50 rounded-lg px-4 py-2 w-full text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-500 backdrop-blur-sm pr-10" {...register("password", { required: "All fields are required.", minLength: { value: 8, message: "Password must be 8 characters long." }, maxLength: { value: 15, message: "Too long Password." } })} />
                                    <p className="text-red-600 text-sm w-full h-3 my-2 col-span-2">{(errors.email || errors.password || errors.firstname || errors.lastname) && (errors.email?.message || errors.password?.message || errors.firstname?.message || errors.lastname?.message)}</p>
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
                                <input type="submit" value="Submit" className="w-full bg-blue-600 p-2 my-4 rounded-lg text-white hover:bg-blue-800 cursor-pointer col-span-2" />
                            </form>

                            <p className="text-white text-center p-4 my-12">Already have an account? <button className="bg-none underline text-blue-700" onClick={navigateToLogin}>Login</button></p>
                        </div>
                    </div>
                    <div className="lg:hidden">
                        <div className="absolute bg-gray-800 right-0 w-1/2 h-full blur-3xl opacity-70 lg:hidden"></div>
                        <img src={DrumKitImage} alt="Drum kit Image" className="w-full h-full" />
                    </div>
                </div>
            </>
    )
}