import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";
import Loader from "./Loader.jsx";
import PopUp from "./PopUp.jsx";
import { IoChevronBackCircleSharp } from "react-icons/io5";
import axios from "axios";

export default function InputEmail() {
    const { register, handleSubmit, formState: { errors }, reset } = useForm({ mode: "onChange" });
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [showNotification, setShowNotification] = useState({show: false, message: "", positiveMessage: true});

    const requestOTP = async (data) => {
        reset();
        setShowNotification({show: true, message: "Requesting for OTP...", positiveMessage: true});
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/users/send-otp`,
                data,
                {
                    withCredentials: true
                }
            )

            if (response) {
                setShowNotification({show: true, message: response.data.message, positiveMessage: true});
            }

            setTimeout(() => {
                setShowNotification({show: false, message: "Requesting for OTP...", positiveMessage: true});
                navigate("/verify-email", {
                    state: {
                        from: location.pathname
                    }
                });
            }, 1000);
        } catch (error) {
            setShowNotification({show: true, message: (error.response?.data.message || 'Failed to connect to server. Try Again Later.'), positiveMessage: false})
            setTimeout(() => {
                setShowNotification({show: false, message: "Requesting for OTP...", positiveMessage: true})
            }, 3000);
        }
    }

    const backClick = () => {
        navigate("/login");
    }

    useEffect(() => {
        if(!location.state){
            navigate("/login");
            return;
        }
        if (location.state.from !== "/login") {
            navigate("/login");
            return;
        }
        setLoading(false);
    }, []);

    return (
        loading ? <Loader /> :
            <>
                {showNotification.show && <PopUp message={showNotification.message} positiveMessage={showNotification.positiveMessage} />}
                <div className="bg-gray-900 min-h-screen p-4">
                    <div className="inline-flex text-gray-400 hover:text-gray-600 items-center cursor-pointer" onClick={backClick}>
                        <IoChevronBackCircleSharp size={40} />
                        <p className="p-2 text-xl">Back</p>
                    </div>

                    <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden w-full max-w-lg h-full p-4 m-auto">
                        <h2 className="text-2xl font-semibold mb-4 text-white text-center">Verify Email</h2>
                        <form action="" onSubmit={handleSubmit(requestOTP)}>
                            <input type="text" placeholder="Enter Your Email" className="bg-transparent border border-slate-400/50 rounded-lg px-4 py-2 w-full text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-500 backdrop-blur-sm" {...register("email", { required: "Email is required.", pattern: { value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: "Email in wrong format." } })} />
                            <p className="text-red-600 text-sm w-full h-3 my-2">{(errors.email && errors.email?.message)}</p>
                            <input type="submit" value="Submit" className="w-full bg-blue-600 p-2 my-4 rounded-lg text-white hover:bg-blue-800 cursor-pointer" />
                        </form>
                    </div>
                </div>
            </>
    )
}