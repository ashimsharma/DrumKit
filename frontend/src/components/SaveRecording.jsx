import React, { useContext } from "react";
import { HomeContext } from "./Home.jsx";
import { useForm } from "react-hook-form";

export default function SaveRecording() {
    const { setRecordingEnded, setRecordingName, setShowNotification, recordingEnded, setRecordingSaved } = useContext(HomeContext);
    const { register, handleSubmit, formState: { errors } } = useForm({ mode: "onChange" });

    const handleSaveClick = (data) => {
        setRecordingName(data.recordingName);
        setRecordingEnded(false);
        setRecordingSaved(true);
    }

    const handleCancelClick = () => {
        setRecordingEnded(false);
    }

    return (
        <>
            <div className={`${!recordingEnded && 'hidden'} fixed top-0 left-0 w-full h-full bg-black opacity-50 blur-[8px] z-10`}></div>
            <div className="w-1/5 absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-xl bg-slate-800 text-center brightness-125 z-20 ring-2 ring-blue-500">
                <div className="p-2">
                    <label htmlFor="save-recording" className="block p-2">Save the Recording</label>
                    <input type="text" id="save-recording" className="bg-transparent border border-slate-400/50 rounded-lg px-4 py-2 w-full text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-500 backdrop-blur-sm" placeholder="Name of Recording..." {...register("recordingName", { required: "Recording Name is Required", maxLength: { value: 15, message: "Name should be about 15 characters." }, pattern: /(?:[\s-][A-Za-z]+)*/ })} />
                    <p className="text-red-600 text-sm w-full h-3 mt-2">{errors.recordingName && errors.recordingName.message}</p>
                </div>
                <button className="bg-blue-600 p-2 rounded-lg m-2 hover:bg-blue-800" onClick={handleSubmit(handleSaveClick)}>Save</button>
                <button className="bg-blue-600 p-2 rounded-lg m-2 hover:bg-blue-800" onClick={handleCancelClick}>Cancel</button>
            </div>
        </>
    )
}