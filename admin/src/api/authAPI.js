import { ref } from "yup";
import axios from "./axios";

const authAPI = {
    login: async (username, password) => {
        const url = "/auth/login";
       
        const response = await axios.post(url, { username, password });
        localStorage.setItem('access_token', response.data.access_token);
        localStorage.setItem('refresh_token', response.data.refresh_token);
       
        return response;
    },
    refreshToken: async () => {
        const url = "/auth/refresh-token";
        const refresh_token = await localStorage.getItem('refresh_token');
        const response = await axios.post(url, { refresh_token });
        localStorage.setItem('access_token', response.data.access_token);
        return response;
    },
    checkLogin: async() => {
        const url = "/auth/check-login";
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
    checkAccessToken: async () => {
        const url = "/auth/check-access-token";
        const access_token = await localStorage.getItem('access_token');
        const response = await axios.post(url, access_token);
        return response;
    },
    updatePassword: async (data) => {
        const url = "/auth/updatePassword";
        await axios.patch(url, data);
    },
    forgotPassword: async (data) => {
        const url = "/auth/forgotPassword";
        await axios.post(url, data);
    },
    resetPassword: async (data, resetToken) => {
        const url = `/auth/resetPassword/${resetToken}`;
        await axios.patch(url, data);
    },
    getStatusResetPasswordToken: async (resetToken) => {
        const url = `/auth/resetPassword/${resetToken}`;
        await axios.get(url);
    },
};

export default authAPI;
