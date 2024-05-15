import axios from "./axios";

const authAPI = {
    employeeLogin: async (username, password) => {
        const url = "/auth/employee/login";
       
        const response = await axios.post(url, { username, password });
        localStorage.setItem('access_token', response.data.access_token);
        localStorage.setItem('refresh_token', response.data.account_id.refresh_token);
       
        return response;
    },
    employeeCheckLogin: async() => {
        const url = "/auth/employee/check-login";
        const access_token = await localStorage.getItem('access_token');
       
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        });
        
        return response;
       
    },
    logout: async () => {
        // const url = "/auth/employee/logout";
        // await axios.get(url);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
    },
};

export default authAPI;
