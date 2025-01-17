import React from "react";

export default function PopUp({message, positiveMessage}) {
    return (
        <div className={`absolute w-fit top-20 left-1/2 transform -translate-x-1/2 ${positiveMessage ?'bg-green-500' : 'bg-red-500'} text-white px-4 py-2 rounded-lg shadow-lg transition-all duration-300 z-30`}>
            {message}
        </div>
    )
}