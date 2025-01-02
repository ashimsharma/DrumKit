import { useState, useRef } from "react";
import DeleteIcon from "../images/icons/delete_icon.png";
import PauseIcon from "../images/icons/pause_icon.png";
import PlayIcon from "../images/icons/play_icon.png";

export default function RecordingCard({recordingName, recordingData, key}){
    let [played, setPlayed] = useState(false);

    const handlePlayOrPause = (e) => {
        setPlayed(!played);
    }

    return(
        <>
            <div className="w-1/2 mx-auto bg-slate-600 p-2 px-4 rounded-lg my-2 ring-2 ring-blue-600 lg:w-3/4 flex" key={key}>
                <div className="basis-3/4 flex items-center">
                    <p>Recording 1</p>
                </div>
                <div className="flex justify-end basis-1/4 gap-2">
                    <div className="bg-blue-600 rounded-lg p-[3px] cursor-pointer hover:bg-blue-800 w-10 flex justify-center" onClick={(e) => handlePlayOrPause(e)}>
                        <img src={!played ? PlayIcon : PauseIcon} alt="Play Icon" className="w-8" />
                    </div>
                    
                    <div className="bg-blue-600 rounded-lg p-[3px] flex items-center cursor-pointer hover:bg-blue-800 w-10 justify-center">
                        <img src={DeleteIcon} alt="Play Icon" className="w-7 h-7 align-middle mix-blend-darken" />
                    </div>
                </div>
            </div>
        </>
    )
}