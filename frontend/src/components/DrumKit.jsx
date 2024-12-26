import React from "react";
// Import images
import DrumKitCrash from "../images/DrumKit-Crash.png";
import DrumKitKick from "../images/DrumKit-Kick.png";
import DrumKitSnare from "../images/DrumKit-Snare.png";
import DrumKitTom2 from "../images/DrumKit-Tom2.png";
import DrumKitTom1Left from "../images/DrumKit-Tom1-Left.png";
import DrumKitTom1Right from "../images/DrumKit-Tom1-Right.png";

export default function(){
    return (
        <>
            <div className="grid grid-cols-5 w-1/2 mx-auto my-10">
                <div className="row-span-2 p-2 text-center flex flex-col justify-center items-center cursor-pointer">
                    <h2 className="font-bold font-mono text-3xl p-4">J</h2>
                    <img src={DrumKitSnare} alt="" className="h-full object-cover"/>
                </div>

                <div className="text-center p-2 max-h-full flex flex-col justify-center items-center cursor-pointer">
                    <h2 className="font-bold font-mono text-3xl p-4">A</h2>
                    <img src={DrumKitTom1Left} alt="" />
                </div>

                <div className="text-center p-2 max-h-full flex flex-col justify-center items-center cursor-pointer">
                    <h2 className="font-bold font-mono text-3xl p-4">D</h2>
                    <img src={DrumKitTom2} alt="" />
                </div>

                <div className="col-start-3 p-2 row-start-1 row-span-2 text-center max-h-full flex flex-col justify-center items-center cursor-pointer">
                    <h2 className="font-bold font-mono text-3xl p-4">K</h2>
                    <img src={DrumKitKick} alt="" />
                </div>

                <div className="col-start-4 p-2 row-start-1 text-center max-h-full flex flex-col justify-center items-center cursor-pointer">
                    <h2 className="font-bold font-mono text-3xl p-4">S</h2>
                    <img src={DrumKitTom1Right} alt="" />
                </div>

                <div className="text-center p-2 max-h-full flex flex-col justify-center items-center cursor-pointer">
                    <h2 className="font-bold font-mono text-3xl p-4">F</h2>
                    <img src={DrumKitTom2} alt="" />
                </div>

                <div className="col-start-5 p-2 row-start-1 row-span-2 text-center max-h-full flex flex-col justify-center items-center cursor-pointer">
                    <h2 className="font-bold font-mono text-3xl p-4">L</h2>
                    <img src={DrumKitCrash} alt="" />
                </div>
            </div>
        </>
    )
}