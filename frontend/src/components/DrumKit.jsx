import React, { useContext, useEffect, useState } from "react";
import { HomeContext } from "./Home.jsx";

// Import images
import DrumKitCrash from "../images/DrumKit-Crash.png";
import DrumKitKick from "../images/DrumKit-Kick.png";
import DrumKitSnare from "../images/DrumKit-Snare.png";
import DrumKitTom2 from "../images/DrumKit-Tom2.png";
import DrumKitTom1Left from "../images/DrumKit-Tom1-Left.png";
import DrumKitTom1Right from "../images/DrumKit-Tom1-Right.png";

// Import sounds
import CrashSound from "../sounds/crash.mp3";
import KickBassSound from "../sounds/kick-bass.mp3";
import SnareSound from "../sounds/snare.mp3";
import Tom1Sound from "../sounds/tom-1.mp3";
import Tom2Sound from "../sounds/tom-2.mp3";
import Tom3Sound from "../sounds/tom-3.mp3";
import Tom4Sound from "../sounds/tom-4.mp3";

export default function () {
    useEffect(() => {
        let keyPressed = false;

        const keyDownFun = (e) => {
            if(keyPressed){
                return;
            }

            keyPressed = true;

            console.log("I ran");

            switch(e.key){
                case 'a':
                    playSound(e, 'a');
                    break;
                case 's':
                    playSound(e, 's');
                    break;
                case 'd':
                    playSound(e, 'd');
                    break;
                case 'f':
                    playSound(e, 'f');
                    break;
                case 'j':
                    playSound(e, 'j');
                    break;
                case 'k':
                    playSound(e, 'k');
                    break;
                case 'l':
                    playSound(e, 'l');
                    break;
                default:
                    return;
            }
        };

        window.addEventListener('keydown', keyDownFun);

        const keyUpFun = () => {
            keyPressed = false;
        };

        window.addEventListener('keyup', keyUpFun);

        return () => {
            window.removeEventListener('keydown', keyDownFun);
            window.removeEventListener('keyup', keyUpFun);
        }
    })
    const [oldTime, setOldTime] = useState();
    const { soundArray, setSoundArray, recordingStarted, setRecordingStarted, checked } = useContext(HomeContext);

    let soundPaths = {
        'a': Tom1Sound,
        's': Tom2Sound,
        'd': Tom3Sound,
        'f': Tom4Sound,
        'j': SnareSound,
        'l': CrashSound,
        'k': KickBassSound
    }

    async function playSound(e, drumString) {
        recordingStarted && recordSound(drumString);

        let sound = new Audio(soundPaths[drumString]);
        await sound.play();
    }

    function recordSound(drumString) {
        if (oldTime !== null) {
            let seconds = new Date().getSeconds();
            let milliSeconds = new Date().getMilliseconds();
            let newTime = seconds * 1000 + milliSeconds;

            if (oldTime >= 50000 && newTime <= 10000) {
                var timeTaken = Math.abs(60000 - Math.abs(newTime - oldTime));
            } else {
                var timeTaken = Math.abs(newTime - oldTime);
            }

            setOldTime(newTime);
        }

        if (oldTime) {
            let valueOfTime = timeTaken;
            let drumStringNtime = [drumString, valueOfTime];
            setSoundArray([...soundArray, drumStringNtime]);
        } else {
            let valueOfTime = !oldTime ? 200 : timeTaken;
            let drumStringNtime = [drumString, valueOfTime];
            setSoundArray([...soundArray, drumStringNtime]);
        }

        if (oldTime === null) {
            let seconds = new Date().getSeconds();
            let milliSeconds = new Date().getMilliseconds();
            setOldTime(seconds * 1000 + milliSeconds);
        }
    }

    return (
        <>
            <div className={`grid grid-cols-5 w-1/2 h-1/2 m-auto my-10 lg:w-full`}>
                <div className="relative row-span-2 p-2 text-center flex flex-col justify-center items-center cursor-pointer">
                    {checked && <div className="absolute flex justify-center items-center text-6xl top-0 left-0 w-full h-full bg-red-100/5 backdrop-blur-[2px] pointer-events-none z-10 text-amber-500 font-bold">J</div>}
                    <img src={DrumKitSnare} alt="" className="h-full hover:brightness-125 lg:aspect-h-full" onClick={(e) => playSound(e, 'j')} />
                </div>

                <div className="relative text-center p-2 max-h-full flex flex-col justify-center items-center cursor-pointer">
                    {checked && <div className="absolute flex justify-center items-center text-6xl top-0 left-0 w-full h-full bg-red-100/5 backdrop-blur-[2px] pointer-events-none z-10 text-amber-500 font-bold">A</div>}
                    <img src={DrumKitTom1Left} alt="" className="hover:brightness-125" onClick={(e) => playSound(e, 'a')} />
                </div>

                <div className="relative text-center p-2 max-h-full flex flex-col justify-center items-center cursor-pointer">
                    {checked && <div className="absolute flex justify-center items-center text-6xl top-0 left-0 w-full h-full bg-red-100/5 backdrop-blur-[2px] pointer-events-none z-10 text-amber-500 font-bold">D</div>}
                    <img src={DrumKitTom2} alt="" className="hover:brightness-125" onClick={(e) => playSound(e, 'd')} />
                </div>

                <div className="relative col-start-3 p-2 row-start-1 row-span-2 text-center max-h-full flex flex-col justify-center items-center cursor-pointer">
                    {checked && <div className="absolute flex justify-center items-center text-6xl top-0 left-0 w-full h-full bg-red-100/5 backdrop-blur-[2px] pointer-events-none z-10 text-amber-500 font-bold">K</div>}
                    <img src={DrumKitKick} alt="" className="hover:brightness-125" onClick={(e) => playSound(e, 'k')} />
                </div>

                <div className="relative col-start-4 p-2 row-start-1 text-center max-h-full flex flex-col justify-center items-center cursor-pointer">
                    {checked && <div className="absolute flex justify-center items-center text-6xl top-0 left-0 w-full h-full bg-red-100/5 backdrop-blur-[2px] pointer-events-none z-10 text-amber-500 font-bold">S</div>}
                    <img src={DrumKitTom1Right} alt="" className="hover:brightness-125" onClick={(e) => playSound(e, 's')} />
                </div>

                <div className="relative text-center p-2 max-h-full flex flex-col justify-center items-center cursor-pointer">
                    {checked && <div className="absolute flex justify-center items-center text-6xl top-0 left-0 w-full h-full bg-red-100/5 backdrop-blur-[2px] pointer-events-none z-10 text-amber-500 font-bold">F</div>}
                    <img src={DrumKitTom2} alt="" className="hover:brightness-125" onClick={(e) => playSound(e, 'f')} />
                </div>

                <div className="relative col-start-5 p-2 row-start-1 row-span-2 text-center max-h-full flex flex-col justify-center items-center cursor-pointer">
                    {checked && <div className="absolute flex text-6xl justify-center items-center top-0 left-0 w-full h-full bg-red-100/5 backdrop-blur-[2px] pointer-events-none z-10 text-amber-500 font-bold">L</div>}
                    <img src={DrumKitCrash} alt="" className="hover:brightness-125" onClick={(e) => playSound(e, 'l')} />
                </div>
            </div>
        </>
    )
}