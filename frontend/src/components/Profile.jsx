import { useEffect, useState } from "react";
import {  useLocation, useNavigate } from "react-router";
import UserIcon from "../images/User-Icon.png";
import { FaEdit } from 'react-icons/fa'
import { IoChevronBackCircleSharp } from "react-icons/io5";
import Loader from "./Loader";
import axios from "axios";

export default function Profile() {
    const prevLocation = useLocation().state?.from;
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(null);
    const [showNotification, setShowNotification] = useState({ show: false, positiveMessage: true, message: ''});
    
    useEffect(() => {
        (async () => {
            const isAuthenticated = await checkIfAuthenticated();
            if(isAuthenticated){
                await getProfile();
            }
        }
        )();
    }, []);

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
            console.log(error);
            navigate("/login");
            return false;
        }
    }

    const backClick = () => {
        if(!prevLocation){
            navigate("/");
            return;
        }
        navigate(prevLocation);
    }

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
            if(!error.response?.data){
                navigate("/login");
                return;
            }

            setShowNotification({show: true, positiveMessage: false, message: error.response?.data.message});
            setTimeout(() => {
                setShowNotification({show: false, positiveMessage: false, message: ''});
            }, 1500);
            setLoading(false);
        }
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        
        // Get the day, month, and year
        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'long' });
        const year = date.getFullYear();
        
        // Function to get the ordinal suffix for the day
        function getOrdinalSuffix(day) {
            if (day > 3 && day < 21) return day + 'th'; // For 4-20, it's always 'th'
            switch (day % 10) {
                case 1: return day + 'st';
                case 2: return day + 'nd';
                case 3: return day + 'rd';
                default: return day + 'th';
            }
        }
    
        return `${getOrdinalSuffix(day)} ${month}, ${year}`;
    }

    const handleEditClick = () => {
        if(!userData.isGuest){
            navigate("/profile/update-profile");
        }
    }

    return (
        loading ? <Loader /> :
        <>
            <div className="bg-gray-900 min-h-screen p-4">
                <div className="inline-flex text-gray-400 hover:text-gray-600 items-center cursor-pointer" onClick={backClick}>
                    <IoChevronBackCircleSharp size={40}/>
                    <p className="p-2 text-xl">Back</p>
                </div>

                <div className="flex justify-center items-center m-8">
                    <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden w-full max-w-lg h-full">
                        <div className="relative h-48 bg-gray-800">
                            <img
                                src={UserIcon}
                                alt="Profile"
                                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full"
                            />
                        </div>

                        <div className="text-center py-6 px-4">
                            <h1 className="text-3xl font-bold text-white">{`${userData.user.firstname} ${userData.user.lastname}`}</h1>
                            <p className="text-lg mt-2 text-gray-300">{`${userData.user.email}`}</p>
                            <p className="text-gray-400 mt-2">{`${userData.isGuest ? 'Guest User' : 'Registered User'}`}</p>

                            <div className="mt-6">
                                <button className="bg-blue-600 hover:bg-blue-800 text-white font-semibold py-2 px-6 rounded-lg mx-2" onClick={handleEditClick}>
                                    {`${userData.isGuest ? 'Register Account' : 'Edit Profile'}`}
                                </button>
                                {!userData.isGuest && <button className="bg-blue-600 hover:bg-blue-800 text-white font-semibold py-2 px-6 rounded-lg mx-2" onClick={() => navigate("/profile/update-password")}>
                                    Edit Password
                                </button>}
                            </div>

                            <div className="mt-2 text-gray-500 mb-0">
                                <p className="mb-0 p-0">Member Since: {`${formatDate(userData.user.createdAt)}`}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}