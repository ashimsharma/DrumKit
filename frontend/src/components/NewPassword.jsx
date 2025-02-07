import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { IoChevronBackCircleSharp, IoEye, IoEyeOff } from "react-icons/io5"; 
import Loader from "./Loader.jsx"; 
import PopUp from "./PopUp.jsx";

export default function NewPassword() {
    const prevLocation = useLocation().state?.from;

    useEffect(() => {
        if(!prevLocation){
            navigate("/login");
            return;
        }
        setLoading(false);
    }, []);

    const [loading, setLoading] = useState(true);
    const [showNotification, setShowNotification] = useState({ show: false, positiveMessage: true, message: '' });

    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        mode: "onChange",
    });

    const navigate = useNavigate();

    const backClick = () => {
        navigate("/profile"); // Navigate to the previous page
    };

    const onSubmit = async (data) => {
        try {
            setShowNotification({ show: true, positiveMessage: true, message: 'Updating Password...' });
            const response = await axios.patch(
                `${import.meta.env.VITE_API_URL}/users/update-password`,
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
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
                {/* Back Button */}
                <div
                    className="absolute top-4 left-4 inline-flex text-gray-400 hover:text-gray-600 items-center cursor-pointer"
                    onClick={backClick}
                >
                    <IoChevronBackCircleSharp size={40} />
                    <p className="p-2 text-xl">Back</p>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="w-full max-w-md p-8 bg-gray-800 rounded-lg shadow-lg"
                >
                    <h2 className="text-3xl font-bold mb-6 text-center">Update Password</h2>

                    {/* Old Password Field */}
                    <div className="relative">
                        <input
                            type={showOldPassword ? "text" : "password"}
                            placeholder="Enter Your Old Password"
                            className="bg-transparent border border-slate-400/50 rounded-lg px-4 py-2 w-full text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-500 backdrop-blur-sm my-4"
                            {...register("oldPassword", { required: "All fields are required.", minLength: { value: 8, message: "Password must be 8 characters long." }, maxLength: { value: 15, message: "Too long Password." } })}
                        />
                        <div
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-200"
                            onClick={() => setShowOldPassword(!showOldPassword)}
                        >
                            {showOldPassword ? <IoEyeOff size={20} /> : <IoEye size={20} />}
                        </div>
                        {errors.oldPassword && (
                            <p className="text-red-500 text-sm mt-1">{errors.oldPassword.message}</p>
                        )}
                    </div>

                    {/* New Password Field */}
                    <div className="relative">
                        <input
                            type={showNewPassword ? "text" : "password"}
                            placeholder="Enter Your New Password"
                            className="bg-transparent border border-slate-400/50 rounded-lg px-4 py-2 w-full text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-500 backdrop-blur-sm my-4"
                            {...register("newPassword", { required: "All fields are required.", minLength: { value: 8, message: "Password must be 8 characters long." }, maxLength: { value: 15, message: "Too long Password." } })}
                        />
                        <div
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                            {showNewPassword ? <IoEyeOff size={20} /> : <IoEye size={20} />}
                        </div>
                        {errors.newPassword && (
                            <p className="text-red-500 text-sm mt-1">{errors.newPassword.message}</p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-2">
                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-800 transition text-white py-2 px-4 rounded-lg mt-4"
                        >
                            Update Password
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
