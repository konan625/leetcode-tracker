const API_URL = "http://localhost:5000/api" //change this later to deployed url
const api = async (endpoint,method="GET",body=null) => {
    const options = {
        method,
        headers:{
            "Content-Type": "application/json"
        },
        credentials: "include" //for cookie if needed
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_URL}${endpoint}`,options);
    const data = await response.json();

    if(!response.ok){
        throw new Error(data.message || "Something went wrong");
    }
    return data;
}

export const signup = (userData) => api("/auth/signup","POST",userData);
export const login = (userData) => api("/auth/login","POST",userData);