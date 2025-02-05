import axios from "axios";

export async function refreshAccessToken(){
    try {
        const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/users/update-accesstoken`,
            {},
            {
                withCredentials: true
            }
        );
        
        return response ? response : false;
    } catch (error) {
        return false;
    }
}

export async function checkIfAuthenticated(){
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/users/check-auth`,
            {
                withCredentials: true
            }
        )
        
        return response ? response : false;
    } catch (error) {
        return false;
    }
}