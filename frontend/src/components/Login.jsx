import React, { useState } from "react";
import DrumKitImage from "../images/DrumKit-Image.jpg";
import Drum from "../images/NavBar-Icon.png";
import { useNavigate } from "react-router";
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { useForm } from "react-hook-form";

export default function Login() {
    const navigate = useNavigate();
    const [passwordVisible, setPasswordVisible] = useState(false);
    const { register, handleSubmit, formState: { errors }, reset } = useForm({ mode: "onChange" });

    const togglePasswordVisibility = () => {
        setPasswordVisible((prev) => !prev);
    };

    const navigateToSignup = () => {
        navigate('/signup')
    };

    const loginUser = (data) => {
        reset();
        console.log(data);
    }
    return (
        <>
            <h1 className="absolute top-10 left-4 text-white font-bold text-3xl lg:hidden z-10">Drum Kit Image</h1>
            <div className="grid grid-cols-2 bg-slate min-h-screen lg:block m-0 h-full min-w-screen w-full">
                <div className="lg:hidden">
                    <div className="absolute bg-gray-800 w-1/2 h-full blur-3xl opacity-70 lg:hidden"></div>
                    <img src={DrumKitImage} alt="Drum kit Image" className="w-full h-full" />
                </div>
                <div className="bg-slate-800 w-full h-full">
                    <div className="flex flex-row justify-end p-4 lg:justify-start">
                        <img src={Drum} alt="Drum Logo" className="h-16" />
                    </div>
                    <div className="p-16 lg:p-16">
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
                            <input type="submit" value="Submit" className="w-full bg-blue-600 p-2 my-4 rounded-lg text-white hover:bg-blue-800 cursor-pointer" />
                        </form>
                        
                        <h2 className="my-2 text-white text-center">OR</h2>
                        <div className="text-center">
                            <button className="bg-emerald-500 hover:bg-emerald-700 p-2 rounded-lg text-white cursor-pointer w-3/4 mt-2">Login as guest</button>
                        </div>
                        <p className="text-white text-center p-4 my-12">Dont't have an account? <button className="bg-none underline text-blue-700" onClick={navigateToSignup}>Create One</button></p>
                    </div>
                </div>
            </div>
        </>
    )
}