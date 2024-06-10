import axios from "./axios";
import removeAccents from "../utils/removeAccents";



const bookingAPI = {
    getAll: async(params) => {
        
        if(params.is_active===undefined){
            params.filter = "is_active:eq:true";
        }else {
            params.filter = "is_active:eq:" + params.is_active;
            delete params.is_active;
        }
        if(params.currentUser.account_id.role_id.id === 3){
            params.filter = params.filter + ",lecturer_code.code:eq:" + params.currentUser.code;
        }
        if(params.search !== ""){
            params.search = removeAccents(params.search);
            params.filter = params.filter + ",name:like:" + params.search;
        }
        if(params.semester_id !== null && params.semester_id !== undefined){
            params.filter = params.filter + ",semester_id.id:eq:" + params.semester_id;
        }
        
        
        switch (params.role_id){
            case 1:
            case 2:
                break;
            case 3:
                params.filter = params.filter + ",lecturer_code.code:eq:" + params.user_code;
                break;
            case 4:
                const access_token = await localStorage.getItem("access_token");
                const student_code = params.user_code;
                const semester_id = params.semester_id;
                const url = `booking/get-all-by-student/${student_code}/${semester_id}`;
                const response = await axios.get(url, {
                    params,
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                    },
                });
                return response;
                
            default:
                break;
        }
        const access_token = await localStorage.getItem("access_token");
        delete params.search;
        const url = "/booking/get-all";
        const response = await axios.get(url, {
            params,
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });
        return response;
    },
    create: async(data) => {
        const access_token = await localStorage.getItem("access_token");
        const url = "/booking/create";
        const response = await axios.post(url, data, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });
        return response;
    },
    createMany: async(data) => {
        const access_token = await localStorage.getItem("access_token");
        const url = "/booking/create-many";
        const response = await axios.post(url, data, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });
        return response;
    },
    update: async(id, data) => {
        const access_token = await localStorage.getItem("access_token");
        const url = `/booking/update/${id}`;
        const response = await axios.patch(url, data, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });
        return response;
    },
    updateMany: async(data) => {
        const access_token = await localStorage.getItem("access_token");
        const url = "/booking/update-many";
        const response = await axios.patch(url, data, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });
        return response;
    },
    getManyByRoomDate: async(room_id, date) => {
        const access_token = await localStorage.getItem("access_token");
        const url = `/booking/get-many-by-room-date/${room_id}/${date}`;
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });
        return response;
    },
};

export default bookingAPI;