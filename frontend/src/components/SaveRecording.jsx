import React, { useContext } from "react";
import { HomeContext } from "./Home.jsx";
import { useForm } from "react-hook-form";

export default function SaveRecording() {
    const { setRecordingEnded, setRecordingName, setShowNotification, recordingEnded } = useContext(HomeContext);
    const { register, handleSubmit, formState: { errors } } = useForm({ mode: "onChange" });

    const handleSaveClick = (data) => {
        setShowNotification({ show: true, positiveMessage: true });
        setTimeout(() => {
            setShowNotification({ show: false, positiveMessage: true });
        }, 3000);
        setRecordingName(data.recordingName);
        setRecordingEnded(false)
    }

    const handleCancelClick = () => {
        setShowNotification({ show: true, positiveMessage: false });
        setTimeout(() => {
            setShowNotification({ show: false, positiveMessage: true });
        }, 3000);
        setRecordingEnded(false);
    }

    return (
        <>
            <div className={`${!recordingEnded && 'hidden'} fixed top-0 left-0 w-full h-full bg-black opacity-50 blur-[8px] z-10`}></div>
            <div className="w-1/5 absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-xl bg-slate-800 text-center brightness-125 z-20 shadow-md shadow-slate-600">
                <div className="p-2">
                    <label htmlFor="save-recording" className="block p-2">Save the Recording</label>
                    <input type="text" id="save-recording" className="block p-1 outline-none mx-auto bg-transparent shadow-sm shadow-white text-white" placeholder="Name of Recording..." {...register("recordingName", { required: "*Recording Name is Required", maxLength: { value: 15, message: "*Name should be about 15 characters." }, pattern: /(?:[\s-][A-Za-z]+)*/ })} />
                    <p className="text-red-600 w-full h-3">{errors.recordingName && errors.recordingName.message}</p>
                </div>
                <button className="bg-red-500 p-2 rounded-lg m-2 hover:bg-red-700" onClick={handleSubmit(handleSaveClick)}>Save</button>
                <button className="bg-red-500 p-2 rounded-lg m-2 hover:bg-red-700" onClick={handleCancelClick}>Cancel</button>
            </div>
        </>
    )
}