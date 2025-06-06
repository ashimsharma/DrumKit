import React, { createContext, useContext, useState, useEffect } from "react";
import RecordingCard from "./RecordingCard.jsx";
import PopUp from "./PopUp.jsx";
import axios from "axios";
import { useNavigate } from "react-router";
import NavBar from "./NavBar.jsx";
import Footer from "./Footer.jsx";
import Loader from "./Loader.jsx";
import { useDispatch } from "react-redux";
import { refreshAccessToken, checkIfAuthenticated } from "../utils/index.js";
import { set } from "../redux/userSlice.js";

export const RecordingsContext = createContext();

export default function () {
    const [recordings, setRecordings] = useState([]);
    const [recordingDatas, setRecordingDatas] = useState({});
    const [showNotification, setShowNotification] = useState({ show: false, positiveMessage: true, message: '' });
    const [playedSoundId, setPlayedSoundId] = useState(null);
    const [recordingDeleted, setRecordingDeleted] = useState(false);

    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    const dispatch = useDispatch();

    useEffect(() => {
        (async () => {
            const isAuthenticated = await checkIfAuthenticated();

            if (isAuthenticated) {
                getRecordings();
                dispatch(set(isAuthenticated.data.data.isGuest));
            }
            else {
                const accessTokenRefresh = await refreshAccessToken();

                if (accessTokenRefresh) {
                    dispatch(set(accessTokenRefresh.data.data.isGuest));
                    await getRecordings();
                    setLoading(false);
                }
                else {
                    navigate("/login");
                }
            }

            setRecordingDeleted(false);
        })();
    }, [recordingDeleted])

    const getRecordings = async () => {
        try {
            const resposne = await axios.get(
                `${import.meta.env.VITE_API_URL}/recordings/get-recordings`,
                {
                    withCredentials: true
                }
            )
            setRecordings(resposne.data.data.recordings);
            setRecordingDatas(resposne.data.data.recordings.reduce((acc, obj) => {
                acc[obj._id] = obj.recordedData;
                return acc;
            }, {}));
            setLoading(false);
            return;
        } catch (error) {
            if (!error['response']) {
                navigate("/login");
                return;
            };

            setShowNotification({ show: true, positiveMessage: false, message: 'Failed to fetch Recordings.' });
            setTimeout(() => {
                setShowNotification({ show: false, positiveMessage: true, message: '' });
            }, 3000);
            setLoading(false);
            return;
        }
    }

    return (
        loading ? <Loader /> : <>
            <RecordingsContext.Provider value={{ recordingDatas, playedSoundId, setPlayedSoundId, setShowNotification, setRecordingDeleted }}>
                {showNotification.show && <PopUp message={showNotification.message} positiveMessage={showNotification.positiveMessage} />}
                <NavBar />
                <div className={`bg-gray-900 text-white h-screen p-6`}>
                    {(recordings.length !== 0) && recordings.map((recording) => {
                        return (
                            <RecordingCard recordingName={recording.name} key={recording._id} id={recording._id} />
                        )
                    })}
                    {
                        (recordings.length === 0) &&
                        <div className="h-3/5 flex items-center justify-center">
                            <p className="text-gray-300 text-sm text-center">
                                Nothing to show here for now.
                            </p>
                        </div>
                    }
                </div>
                <Footer />
            </RecordingsContext.Provider>
        </>
    )
}