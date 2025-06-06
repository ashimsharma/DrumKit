import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import UserIcon from "../images/User-Icon.png";
import { IoChevronBackCircleSharp } from "react-icons/io5";
import Loader from "./Loader";
import axios from "axios";
import { refreshAccessToken, checkIfAuthenticated } from "../utils/index.js";
import { useDispatch } from "react-redux";
import { set } from "../redux/userSlice.js";

export default function Profile() {
    const dispatch = useDispatch();

    useEffect(() => {
        (async () => {
            const isAuthenticated = await checkIfAuthenticated();
            if (isAuthenticated) {
                await getProfile();
                dispatch(set(isAuthenticated.data.data.isGuest));
            }
            else {
                const accessTokenRefresh = await refreshAccessToken();

                if (accessTokenRefresh) {
                    dispatch(set(accessTokenRefresh.data.data.isGuest));
                    await getProfile();
                    setLoading(false);
                }
                else {
                    navigate("/login");
                }
            }
        }
        )();
    }, []);

    const prevLocation = useLocation().state?.from;
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(null);
    const [showNotification, setShowNotification] = useState({ show: false, positiveMessage: true, message: '' });

    const backClick = () => {
        if (!prevLocation) {
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
        if (!userData.isGuest) {
            navigate("/profile/update-profile", {
                state: {
                    from: location.pathname
                }
            });
        }
        else {
            navigate("/profile/register-guest", {
                state: {
                    from: location.pathname
                }
            });
        }
    }

    return (
        loading ? <Loader /> :
            <>
                {showNotification.show && <PopUp message={showNotification.message} positiveMessage={showNotification.positiveMessage} />}
                <div className="bg-gray-900 min-h-screen p-4">
                    <div className="inline-flex text-gray-400 hover:text-gray-600 items-center cursor-pointer" onClick={backClick}>
                        <IoChevronBackCircleSharp size={40} />
                        <p className="p-2 text-xl">Back</p>
                    </div>

                    <div className="flex justify-center items-center m-4">
                        <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden w-full max-w-lg h-full">
                            <div className="relative h-48 bg-gray-800">
                                <img
                                    src={UserIcon}
                                    alt="Profile"
                                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 lg:w-30 lg:h-30 rounded-full"
                                />
                            </div>

                            <div className="text-center py-6 px-4">
                                <h1 className="text-3xl lg:text-2xl font-bold text-white">{userData.isGuest ? `${userData.user.name}` : `${userData.user.firstname} ${userData.user.lastname}`}</h1>
                                <p className="text-lg lg:text-md mt-2 text-gray-300">{userData.isGuest ? `` : `${userData.user.email}`}</p>
                                <p className="text-gray-400 mt-2">{`${userData.isGuest ? 'Guest User' : 'Registered User'}`}</p>

                                <div className="mt-6">
                                    <button className="bg-blue-600 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded-lg mx-2 my-2" onClick={handleEditClick}>
                                        {`${userData.isGuest ? 'Register Account' : 'Edit Profile'}`}
                                    </button>
                                    {!userData.isGuest && <button className="bg-blue-600 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded-lg mx-2 my-2" onClick={() => navigate("/profile/update-password")}>
                                        Edit Password
                                    </button>}
                                    {!userData.isGuest && <button className="bg-blue-600 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded-lg mx-2 my-2" onClick={() => navigate("/profile/delete-account")}>
                                        Delete Account
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