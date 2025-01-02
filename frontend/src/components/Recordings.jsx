import React from "react";
import RecordingCard from "./RecordingCard.jsx";

export default function(){
    return (
        <>
            <div className="bg-gray-900 text-white h-screen">
                <h1 className="text-center text-4xl p-4">Recordings</h1>
                <RecordingCard />
            </div>
        </>
    )
}