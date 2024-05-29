import axios from "./axios";
import removeAccents from "../utils/removeAccents";

const classAPI = {
  getAllWithoutParams: async () => {
    const access_token = await localStorage.getItem("access_token");
    
  
    const url = "/class/get-all";
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    return response;
  },
  getAll: async (params) => {
    
  
    if(params.is_active===undefined){
      params.filter = "is_active:eq:true";
    }else {
      params.filter = "is_active:eq:" + params.is_active;
      delete params.is_active;
    }
    

    if (params.search !== "") {
      params.search = removeAccents(params.search);
      params.filter = params.filter + ",name:like:" + params.search;
    }

    const access_token = await localStorage.getItem("access_token");
    
    delete params.search;
    const url = "/class/get-all";
    const response = await axios.get(url, {
      params,
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
  
    return response;
  },

  create: async (data) => {
    const url = "/class/create";
    const access_token = await localStorage.getItem("access_token");

    const response = await axios.post(url, data, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    console.log(response);
    return response;
  },

  update: async (code, data) => {
    const url = `/class/update/${code}`;
    const access_token = await localStorage.getItem("access_token");
    console.log(url);
    const response = await axios.patch(url, data, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    return response;
  },

  updateMany: async (data) => {
    const url = "/class/update-many";
    const access_token = await localStorage.getItem("access_token");
    const response = await axios.patch(url, data, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    return response;
  },
};
export default classAPI;
