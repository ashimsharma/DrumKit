import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { IoChevronBackCircleSharp, IoEye, IoEyeOff } from "react-icons/io5"; // Import show/hide icons
import Loader from "./Loader.jsx"; // Import your Loader component
import PopUp from "./PopUp.jsx";
import { useDispatch } from "react-redux";
import { set } from "../redux/userSlice.js";
import { checkIfAuthenticated } from "../utils/index.js";

export default function DeleteAccount() {
    useEffect(() => {
        (async () => {
            const isAuthenticated = await checkIfAuthenticated();
            if (isAuthenticated) {
                setLoading(false);
            }
            else {
                navigate("/");
            }
        })();
    }, []);

    const [loading, setLoading] = useState(true);
    const [showNotification, setShowNotification] = useState({ show: false, positiveMessage: true, message: '' });

    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm({
        mode: "onChange",
    });

    const navigate = useNavigate();

    const backClick = () => {
        navigate("/profile"); // Navigate to the previous page
    };

    const onSubmit = async (data) => {
        reset();
        try {
            setShowNotification({ show: true, positiveMessage: true, message: 'Deleting Account...' });
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/users/delete-account`,
                data,
                {
                    withCredentials: true,
                }
            );

            if (response) {
                setShowNotification({ show: true, positiveMessage: true, message: response.data.message });
            }

            setTimeout(() => {
                setShowNotification({ show: false, positiveMessage: false, message: '' });
                navigate("/")
            }, 1500);
        } catch (error) {
            if (!error.response?.data) {
                navigate("/login");
                return;
            }

            setShowNotification({ show: true, positiveMessage: false, message: error.response?.data.message });
            setTimeout(() => {
                setShowNotification({ show: false, positiveMessage: false, message: '' });
            }, 1500);
        }
    };

    if (loading) {
        return <Loader />;
    }

    return (
        <>
            {showNotification.show && <PopUp message={showNotification.message} positiveMessage={showNotification.positiveMessage} />}
            <div className="min-h-screen flex flex-col gap-4 bg-gray-900 text-white">
                {/* Back Button */}
                <div
                    className="flex text-gray-400 hover:text-gray-600 items-center cursor-pointer m-4"
                    onClick={backClick}
                >
                    <IoChevronBackCircleSharp size={40} />
                    <p className="p-2 text-xl">Back</p>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="w-1/3 lg:w-4/5 mx-auto p-8 bg-gray-800 rounded-lg shadow-lg"
                >
                    <h2 className="text-3xl font-bold mb-6 text-center">Delete Account</h2>

                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter Your Password"
                            className="bg-transparent border border-slate-400/50 rounded-lg px-4 py-2 w-full text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-500 backdrop-blur-sm my-4"
                            {...register("password", { required: "Password is required." })}
                        />
                        <div
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-200"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {!showPassword ? <IoEyeOff size={20} /> : <IoEye size={20} />}
                        </div>
                    </div>
                    <p className="text-red-500 text-sm mt-1 h-4">{errors.password?.message}</p>

                    <div className="lg:text-center">
                        <button type="button" className="bg-none underline text-blue-700" onClick={() => navigate('/forgot-password-email-input', {
                            state: {
                                from: location.pathname
                            }
                        })}>Forgot Password?</button>
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-2">
                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-800 transition text-white py-2 px-4 rounded-lg mt-4"
                        >
                            Delete Account
                        </button>
                    </div>
                </form >
            </div >
        </>
    );
}
