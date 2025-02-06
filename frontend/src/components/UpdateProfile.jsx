import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { IoChevronBackCircleSharp } from "react-icons/io5"; // Import the icon
import Loader from "./Loader.jsx"; // Import your Loader component
import PopUp from "./PopUp.jsx";
import { useDispatch } from "react-redux";
import { set } from "../redux/userSlice.js";
import { checkIfAuthenticated } from "../utils/index.js";

export default function UpdateProfile() {
    const dispatch = useDispatch();

    useEffect(() => {
        (async () => {
            const isAuthenticated = await checkIfAuthenticated();
            if (isAuthenticated) {
                setLoading(false);
                await getProfile();
            }
            else{
                navigate("/");
            }
        })();
    }, []);

    const [loading, setLoading] = useState(true);
    const [showNotification, setShowNotification] = useState({ show: false, positiveMessage: true, message: '' });
    const [userData, setUserData] = useState({});

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm(
        {
            values: userData.user,
            mode: "onChange"
        }
    );

    const navigate = useNavigate();

    const backClick = () => {
        navigate("/profile"); // Navigate to the previous page
    };

    const getProfile = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/users/get-user`,
                {
                    withCredentials: true
                }
            )

            setUserData(response.data.data);
            setLoading(false);
            return;
        } catch (error) {
            if (!error.response?.data) {
                navigate("/login");
                return;
            }

            setShowNotification({ show: true, positiveMessage: false, message: error.response?.data.message });
            setTimeout(() => {
                setShowNotification({ show: false, positiveMessage: false, message: '' });
            }, 1500);
            setLoading(false);
        }
    }

    const onSubmit = async (data) => {
        try {
            setShowNotification({ show: true, positiveMessage: true, message: 'Updating User...' });
            const response = await axios.patch(
                `${import.meta.env.VITE_API_URL}/users/update-user`,
                data,
                {
                    withCredentials: true
                }
            )

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
                    <h2 className="text-3xl font-bold mb-6 text-center">Update Profile</h2>

                    {/* Email Field */}
                    <div>
                        <input
                            type="text"
                            placeholder="Enter Your Email"
                            className="bg-transparent border border-slate-400/50 rounded-lg px-4 py-2 w-full text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-500 backdrop-blur-sm my-4"
                            {...register("email", {
                                required: "Email is required.",
                                pattern: {
                                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                    message: "Email is in the wrong format.",
                                },
                            })}
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                        )}
                    </div>

                    {/* First Name Field */}
                    <div>
                        <input
                            type="text"
                            placeholder="Enter Your First Name"
                            className="bg-transparent border border-slate-400/50 rounded-lg px-4 py-2 w-full text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-500 backdrop-blur-sm my-4"
                            {...register("firstname", { required: "First name is required." })}
                        />
                        {errors.firstname && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.firstname.message}
                            </p>
                        )}
                    </div>

                    {/* Last Name Field */}
                    <div>
                        <input
                            type="text"
                            placeholder="Enter Your Last Name"
                            className="bg-transparent border border-slate-400/50 rounded-lg px-4 py-2 w-full text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-500 backdrop-blur-sm my-4"
                            {...register("lastname", { required: "Last name is required." })}
                        />
                        {errors.lastname && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.lastname.message}
                            </p>
                        )}
                    </div>

                    {/* Submit Button */}

                    <div className="flex gap-2">
                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-800 transition text-white py-2 px-4 rounded-lg mt-4"
                        >
                            Update Profile
                        </button>
                    </div>
                    <Link to={"/profile/update-password"} className="text-underline text-blue-600 mt-2 block text-center">Update Password?</Link>
                </form>
            </div>
        </>
    );
};
