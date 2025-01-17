import React from "react";

export default function Loader() {
    return (
        <div className="flex items-center justify-center h-screen bg-gray-900">
            <div className="flex items-center justify-center w-24 h-24 bg-gray-800 border border-gray-700 rounded-lg">
                <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce1"></div>
                    <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce2"></div>
                    <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce3"></div>
                </div>
            </div>
        </div>
    );
}
