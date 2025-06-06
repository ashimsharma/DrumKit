import React, { useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { IoChevronBackCircleSharp, IoEye, IoEyeOff } from "react-icons/io5";
import Loader from "./Loader.jsx";
import PopUp from "./PopUp.jsx";

export default function NewPassword() {
    const prevLocation = useLocation().state?.from;

    useEffect(() => {
        if (!prevLocation) {
            navigate("/login");
            return;
        }
        setLoading(false);
    }, []);

    const [loading, setLoading] = useState(true);
    const [showNotification, setShowNotification] = useState({ show: false, positiveMessage: true, message: '' });

    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm({
        mode: "onChange",
    });

    const newPassword = watch('newPassword');
    const confirmPassword = watch('confirmPassword');

    const navigate = useNavigate();

    const backClick = () => {
        navigate("/profile");
    };

    const generateNewPassword = async (data) => {
        reset();
        try {
            setShowNotification({ show: true, positiveMessage: true, message: 'Updating Password...' });
            const response = await axios.patch(
                `${import.meta.env.VITE_API_URL}/users/generate-new-password`,
                { ...data, type: "Update Password." },
                {
                    withCredentials: true,
                }
            );

            if (response) {
                setShowNotification({ show: true, positiveMessage: true, message: response.data.message });
            }

            setTimeout(() => {
                setShowNotification({ show: false, positiveMessage: false, message: '' });
                navigate('/profile');
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
                    className="inline-flex text-gray-400 hover:text-gray-600 items-center cursor-pointer m-4"
                    onClick={backClick}
                >
                    <IoChevronBackCircleSharp size={40} />
                    <p className="p-2 text-xl">Back</p>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit(generateNewPassword)}
                    className="w-1/3 lg:w-11/12 mx-auto p-8 bg-gray-800 rounded-lg shadow-lg"
                >
                    <h2 className="text-3xl font-bold mb-6 text-center">Generate New Password</h2>

                    {/* Old Password Field */}
                    <div className="relative">
                        <input
                            type={showNewPassword ? "text" : "password"}
                            placeholder="Enter Password"
                            className="bg-transparent border border-slate-400/50 rounded-lg px-4 py-2 w-full text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-500 backdrop-blur-sm my-4"
                            {...register("newPassword", { required: "All fields are required.", minLength: { value: 8, message: "Password must be 8 characters long." }, maxLength: { value: 15, message: "Too long Password." } })}
                        />
                        <div
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-200"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                            {!showNewPassword ? <IoEyeOff size={20} /> : <IoEye size={20} />}
                        </div>
                    </div>
                    <div className="relative">
                        <input
                            disabled={errors.newPassword || !newPassword ? true : false}
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm Password"
                            className="bg-transparent border border-slate-400/50 rounded-lg px-4 py-2 w-full text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-500 backdrop-blur-sm my-4 disabled:opacity-50 disabled:cursor-not-allowed"
                            {...register("confirmPassword", {
                                required: "All fields are required.", minLength: { value: 8, message: "Password must be 8 characters long." }, maxLength: { value: 15, message: "Too long Password." }, validate: (value) => value === newPassword || "Values do not match."
                            })}
                        />
                        <div
                            className="absolute right-4 top-9 transform -translate-y-1/2 cursor-pointer"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            {!showConfirmPassword ? <IoEyeOff size={20} /> : <IoEye size={20} />}
                        </div>
                        <p className="text-red-500 text-sm h-4">{errors.newPassword?.message || errors.confirmPassword?.message}</p>
                    </div>
                    
                    <div className="flex gap-2">
                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-800 transition text-white py-2 px-4 rounded-lg mt-4"
                        >
                            New Password
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
