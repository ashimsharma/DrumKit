import { useState, useRef } from "react";
import { FaPlay, FaPause } from "react-icons/fa";
import {MdDelete} from "react-icons/md";

export default function RecordingCard({recordingName, recordingData}){
    let [played, setPlayed] = useState(false);

    const handlePlayOrPause = (e) => {
        setPlayed(!played);
    }

    return(
        <>
            <div className="w-1/2 mx-auto bg-slate-600 p-2 px-4 rounded-lg my-6 ring-2 ring-blue-600 lg:w-3/4 flex">
                <div className="basis-3/4 flex items-center">
                    <p>{recordingName}</p>
                </div>
                <div className="flex justify-end basis-1/4 gap-2">
                    <div className={`bg-blue-600 rounded-lg p-2 cursor-pointer hover:bg-blue-800 flex justify-center items-center`} onClick={(e) => handlePlayOrPause(e)}>
                        {!played ? <FaPlay /> : <FaPause />}
                    </div>
                    
                    <div className="bg-red-600 rounded-lg p-2 flex items-center cursor-pointer hover:bg-red-800 justify-center">
                        <MdDelete size={20} />
                    </div>
                </div>
            </div>
        </>
    )
}