import React, { createContext, useContext, useState, useEffect } from "react";
import RecordingCard from "./RecordingCard.jsx";
import PopUp from "./PopUp.jsx";
import axios from "axios";
import { useNavigate } from "react-router";
import NavBar from "./NavBar.jsx";
import Footer from "./Footer.jsx";
import Loader from "./Loader.jsx";

export const RecordingsContext = createContext();

export default function(){
    const [deletedRecordingId, setDeletedRecordingId] = useState(null);
    const [recordings, setRecordings] = useState([]);
    const [showNotification, setShowNotification] = useState({ show: false, positiveMessage: true, message: ''});
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            const isAuthenticated = await checkIfAuthenticated();

            if(isAuthenticated)
                getRecordings();
        })();
    }, [])

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
            navigate("/login");
            return false;
        }
    }

    const getRecordings = async () => {
        try {
            const resposne = await axios.get(
                `${import.meta.env.VITE_API_URL}/recordings/get-recordings`,
                {
                    withCredentials: true
                }
            )
            setRecordings(resposne.data.data.recordings);
            setLoading(false);
            return;
        } catch (error) {
            if(!error['response']) {
                navigate("/login");
                return;
            };

            setShowNotification({ show: true, positiveMessage: false, message: 'Failed to fetch Recordings.'});
            setTimeout(() => {
                setShowNotification({ show: false, positiveMessage: true, message: ''});
            }, 3000);
            setLoading(false);
            return;
        }
    }
    
    return (
        loading ? <Loader /> : <>
            <RecordingsContext.Provider value={{setDeletedRecordingId}}>
                {showNotification.show && <PopUp message={showNotification.message} positiveMessage={showNotification.positiveMessage} />}
                <NavBar />
                <div className="bg-gray-900 text-white h-screen">
                    <h1 className="text-center text-4xl p-4">Recordings</h1>
                    {recordings.map((recording) => {
                        return (
                            <RecordingCard recordingName={recording.name} recordingData={recording.recordedData} key={recording._id} />
                        )
                    })}
                </div>
                <Footer />
            </RecordingsContext.Provider>
        </>
    )
}