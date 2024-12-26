import React, { useContext } from "react";
import { HomeContext } from "./Home.jsx";
import {useForm} from "react-hook-form";

export default function SaveRecording(){
    const {setRecordingEnded, setRecordingName, setShowNotification} = useContext(HomeContext);
    const {register, handleSubmit, formState: {errors}} = useForm({mode: "onChange"});

    const handleSaveClick = (data) => {
        setShowNotification({show: true, positiveMessage: true});
        setTimeout(() => {
            setShowNotification({show: false, positiveMessage: true});
        }, 3000);
        setRecordingName(data.recordingName);
        setRecordingEnded(false)
    }

    const handleCancelClick = () => {
        setShowNotification({show: true, positiveMessage: false});
        setTimeout(() => {
            setShowNotification({show: false, positiveMessage: true});
        }, 3000);
        setRecordingEnded(false);
    }

    return (
        <div className="w-1/5 mx-auto rounded-xl shadow-[0_-4px_10px_rgba(0,_0,_0,_0.4)] text-center">
            <div className="p-2">
                <label htmlFor="save-recording" className="block p-2">Save the Recording</label>
                <input type="text" id="save-recording" className="block p-1 bg-none text-black outline-none mx-auto" placeholder="Name of Recording..." {...register("recordingName", {required: "*Recording Name is Required", maxLength: {value: 15, message: "*Name should be about 15 characters."}, pattern: /(?:[\s-][A-Za-z]+)*/ })}/>
                <p className="text-red-600 w-full h-3">{errors.recordingName && errors.recordingName.message}</p>
            </div>
            <button className="bg-red-500 p-2 rounded-lg m-2" onClick={handleSubmit(handleSaveClick)}>Save</button>
            <button className="bg-red-500 p-2 rounded-lg m-2" onClick={handleCancelClick}>Cancel</button>
        </div>
    )
}