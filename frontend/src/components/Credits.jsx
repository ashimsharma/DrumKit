import { IoChevronBackCircleSharp } from "react-icons/io5"
import { Link, useLocation, useNavigate } from "react-router"

export default function Credits() {
    const prevLocation = useLocation()?.state?.pathname ?? "/";
    const navigate = useNavigate();

    const backClick = () => {
        navigate(prevLocation);
    }

    return (
        <div className="bg-gray-900 min-h-screen p-4">
            <div className="inline-flex text-gray-400 hover:text-gray-600 items-center cursor-pointer" onClick={backClick}>
                <IoChevronBackCircleSharp size={40} />
                <p className="p-2 text-xl">Back</p>
            </div>
            <div className="bg-gray-800 text-slate-200 p-6 rounded-2xl max-w-2xl mx-auto mt-10 shadow-lg">
                <h2 className="text-2xl font-semibold mb-4 text-white">Credits</h2>

                <ul className="space-y-3 text-sm leading-relaxed">
                    <li>
                        <a
                            href="https://www.flaticon.com/free-icons/drums"
                            title="drums icons"
                            className="text-blue-400 hover:underline"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Drums icons created by Freepik - Flaticon
                        </a>
                    </li>
                    <li>
                        <a href="https://www.flaticon.com/free-icons/profile" title="profile icons" className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">Profile icons created by Stockio - Flaticon</a>
                    </li>
                    <li>
                        <a href="https://www.flaticon.com/free-icons/stop-button" title="stop button icons" className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">Stop button icons created by sonnycandra - Flaticon</a>
                    </li>

                    <li>
                        Website developed by <span className="font-medium text-white hover:underline cursor-pointer"><Link to="https://linkedin.com/in/ashim-sharma7" target="_blank">Ashim Sharma</Link></span>
                    </li>
                </ul>

                <div className="mt-6 text-xs text-slate-400">
                    &copy; {new Date().getFullYear()} All rights reserved.
                </div>
            </div>
        </div>
    )
}