import React, { createContext, useState, useEffect, useRef } from "react";
import DrumKit from "./DrumKit.jsx";
import RecordToolBar from "./RecordToolBar.jsx";
import SaveRecording from "./SaveRecording.jsx";
import PopUp from "./PopUp.jsx";
import axios from "axios";
import NavBar from "./NavBar.jsx";
import Footer from "./Footer.jsx";
import { useNavigate } from "react-router";
import Loader from "./Loader.jsx";
import { useDispatch } from "react-redux";
import { set } from "../redux/userSlice.js";
import { checkIfAuthenticated, refreshAccessToken } from "../utils/index.js";

export const HomeContext = createContext();

export default function Home() {
    const dispatch = useDispatch();
    const [recordingStarted, setRecordingStarted] = useState(false);
    const [recordingEnded, setRecordingEnded] = useState(false);
    const [recordingSaved, setRecordingSaved] = useState(false);
    const [recordingName, setRecordingName] = useState('');
    const [showNotification, setShowNotification] = useState({ show: false, positiveMessage: true, message: '' });
    const [soundArray, setSoundArray] = useState([]);
    const [loading, setLoading] = useState(true);
    const [checked, setChecked] = useState(false);
    const navigate = useNavigate();
    const saveRecordingShown = useRef(false);

    useEffect(() => {
        (async () => {
            if (recordingSaved) {
                saveRecording();
                return;
            }

            const isAuthenticated = await checkIfAuthenticated();
            if (isAuthenticated) {
                dispatch(set(isAuthenticated.data.data.isGuest));
                setLoading(false);
            }
            else {
                const accessTokenRefresh = await refreshAccessToken();

                if (accessTokenRefresh) {
                    dispatch(set(accessTokenRefresh.data.data.isGuest));
                    setLoading(false);
                }
                else {
                    navigate("/login");
                }
            }
        })();
    }, [recordingSaved]);

    const saveRecording = async () => {
        try {
            const resposne = await axios.post(
                `${import.meta.env.VITE_API_URL}/recordings/post-recording`,
                { name: recordingName, recordedData: soundArray },
                { withCredentials: true }
            )

            if (resposne) {
                setShowNotification({ show: true, positiveMessage: true, message: "Recording Saved Successfully." });
                setTimeout(() => {
                    setShowNotification({ show: false, positiveMessage: true, message: "" });
                }, 3000);
            }

            setSoundArray([]);
            setRecordingName('');
            setRecordingSaved(false);
        } catch (error) {
            setShowNotification({ show: true, positiveMessage: false, message: "Recording not Saved." });
            setTimeout(() => {
                setShowNotification({ show: false, positiveMessage: true, message: "" });
            }, 3000);

            setSoundArray([]);
            setRecordingName('');
            setRecordingSaved(false);
        }
        saveRecordingShown.current = false;
    }

    return (
        loading ? <Loader /> :
            <>
                <HomeContext.Provider value={{ recordingStarted, setRecordingStarted, recordingEnded, setRecordingEnded, recordingName, setRecordingName, setShowNotification, soundArray, setSoundArray, recordingSaved, setRecordingSaved, checked, saveRecordingShown }}>
                    <NavBar />
                    <main className={`bg-gray-900 text-white p-4 h-screen`}>
                        {showNotification.show && <PopUp message={showNotification.message} positiveMessage={showNotification.positiveMessage} />}
                        <DrumKit />
                        <RecordToolBar />
                        <label className={`flex items-center justify-center space-x-2 cursor-pointer lg:hidden ${checked ? "text-red-400" : "text-white"}`}>
                            <input
                                type="checkbox"
                                className="hidden"
                                checked={checked}
                                onChange={() => setChecked(!checked)}
                            />

                            <div className={`w-5 h-5 border-2 border-gray-400 rounded-md flex items-center justify-center transition-all ${checked ? "bg-red-400 border-red-400" : "bg-transparent"}`}>
                                {checked && (
                                    <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                )}
                            </div>

                            <span className="select-none">Show keyboard shortcuts?</span>
                        </label>
                        {recordingEnded && <SaveRecording />}
                    </main>
                    <Footer />
                </HomeContext.Provider>
            </>
    );
}