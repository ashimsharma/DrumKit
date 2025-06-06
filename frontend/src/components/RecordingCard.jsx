import { useState, useRef, useContext } from "react";
import { FaPlay, FaPause } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

// Import sounds
import CrashSound from "../sounds/crash.mp3";
import KickBassSound from "../sounds/kick-bass.mp3";
import SnareSound from "../sounds/snare.mp3";
import Tom1Sound from "../sounds/tom-1.mp3";
import Tom2Sound from "../sounds/tom-2.mp3";
import Tom3Sound from "../sounds/tom-3.mp3";
import Tom4Sound from "../sounds/tom-4.mp3";
import { RecordingsContext } from "./Recordings.jsx";
import axios from "axios";

export default function RecordingCard({ recordingName, id }) {
    let [played, setPlayed] = useState(false);
    const playedBool = useRef(false);
    const { recordingDatas, playedSoundId, setPlayedSoundId, setShowNotification, setRecordingDeleted } = useContext(RecordingsContext);

    let soundPaths = {
        'a': Tom1Sound,
        's': Tom2Sound,
        'd': Tom3Sound,
        'f': Tom4Sound,
        'j': SnareSound,
        'l': CrashSound,
        'k': KickBassSound
    }

    const showError = () => {
        setShowNotification({ show: true, positiveMessage: false, message: `Cannot play. A recording is already playing.` });

        setTimeout(() => {
            setShowNotification({ show: false, positiveMessage: true, message: '' });
        }, 3000);
    }

    const handlePlayOrPause = (e) => {
        if (playedSoundId) {
            showError();
            return;
        }

        setPlayedSoundId(id);

        setPlayed(!played);

        playRecording(e);
    }

    const deleteRecording = async (e) => {
        try {
            const response = await axios.delete(
                `${import.meta.env.VITE_API_URL}/recordings/delete-recording`,
                {
                    data: {
                        id
                    },
                    withCredentials: true 
                }
            );

            if (response) {
                setRecordingDeleted(true);
            }

            setShowNotification({ show: true, positiveMessage: false, message: `Recording Deleted Successfully.` });

            setTimeout(() => {
                setShowNotification({ show: false, positiveMessage: true, message: '' });
            }, 3000);
        } catch (error) {
            console.log(error?.message);
            setShowNotification({ show: true, positiveMessage: false, message: `Cannot Delete Recording.` });

            setTimeout(() => {
                setShowNotification({ show: false, positiveMessage: true, message: '' });
            }, 3000);
        }
    }

    const playRecording = async (e) => {
        updatePlay()
        let recordedSound = recordingDatas[id];

        for (let i = 0; i < recordedSound.length; i++) {
            // e.target.parentElement.previousSibling.classList.add('visibility');
            await delay(recordedSound[i][1]);
            // e.target.parentElement.previousSibling.classList.remove('visibility');
            playedBool.current && playSound(recordedSound[i][0]);

            if (!playedBool.current) {
                setPlayed(false);
                return;
            };

        }
        setPlayed(false);
        setPlayedSoundId(null);
        playedBool.current = !playedBool.current;
    }

    const playSound = async (soundString) => {
        let audio = new Audio(soundPaths[soundString]);
        return audio.play();
    }

    const delay = (delayTime) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve('Delay Done');
            }, delayTime)
        })
    }

    const updatePlay = () => {
        playedBool.current = !playedBool.current;
    }

    return (
        <>
            <div className="w-1/2 mx-auto bg-slate-600 p-2 px-4 rounded-lg my-6 ring-2 ring-blue-600 lg:w-3/4 flex">
                <div className="basis-3/4 flex items-center">
                    <p>{recordingName}</p>
                </div>
                <div className="flex justify-end basis-1/4 gap-2">
                    <div className={`bg-blue-600 rounded-lg p-2 cursor-pointer hover:bg-blue-800 flex justify-center items-center`} onClick={(e) => handlePlayOrPause(e)}>
                        {!played ? <FaPlay /> : <FaPause />}
                    </div>

                    <div className="bg-red-600 rounded-lg p-2 flex items-center cursor-pointer hover:bg-red-800 justify-center" onClick={(e) => deleteRecording(e)}>
                        <MdDelete size={20} />
                    </div>
                </div>
            </div>
        </>
    )
}