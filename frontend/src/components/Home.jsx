import React, { createContext, useState } from "react";
import DrumKit from "./DrumKit.jsx";
import RecordToolBar from "./RecordToolBar.jsx";
import SaveRecording from "./SaveRecording.jsx";
import PopUp from "./PopUp.jsx";

export const HomeContext = createContext();

export default function Home() {
    const [recordingStarted, setRecordingStarted] = useState(false);
    const [recordingEnded, setRecordingEnded] = useState(false);
    const [recordingName, setRecordingName] = useState('');
    const [showNotification, setShowNotification] = useState({show: false, positiveMessage: true});

    return (
        <>

            <HomeContext.Provider value={{ recordingStarted, setRecordingStarted, recordingEnded, setRecordingEnded, recordingName, setRecordingName, setShowNotification }}>
                <main className={`bg-gray-900 text-white p-4 h-screen`}>
                    {showNotification.show && <PopUp message={showNotification.positiveMessage ? "Recording Saved Successfully." : "Recording not saved."} positiveMessage={showNotification.positiveMessage}/>}
                    <DrumKit />
                    <RecordToolBar />
                    {recordingEnded && <SaveRecording />}
                </main>
            </HomeContext.Provider>
        </>
    );
}