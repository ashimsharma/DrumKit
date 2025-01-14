import React, { useContext, useState } from "react";
import RecordButton from "../images/Record-Button.png";
import StopButton from "../images/Stop-Button.png";
import { HomeContext } from "./Home.jsx";

export default function RecordToolBar() {
    const {recordingStarted, setRecordingStarted, setRecordingEnded, recordingEnded} = useContext(HomeContext);

    const handleRecordClick = () => {
        if(recordingEnded){
            return;
        }
        setRecordingStarted(true);
    }

    const handleStopClick = () => {
        if(!recordingStarted || recordingEnded){
            return;
        }
        setRecordingStarted(false);
        setRecordingEnded(true);
    }

    return (
        <div className="w-1/6 lg:w-1/2 mx-auto my-4 rounded-3xl bg-white bg-opacity-30 shadow-md shadow-slate-400 flex justify-center gap-3 items-center">
            <div>
                <img src={RecordButton} alt="Record Button" title="Record" className={`w-10 ${recordingStarted && 'drop-shadow-2xl shadow-red-500'} ${recordingEnded && 'opacity-50'} cursor-pointer`} onClick={handleRecordClick} />
            </div>
            <div>
                <img src={StopButton} alt="Stop Button" title="Stop" className={`w-12 ${(!recordingStarted || recordingEnded) && 'opacity-50'} cursor-pointer`} onClick={handleStopClick} />
            </div>
        </div>
    );
}