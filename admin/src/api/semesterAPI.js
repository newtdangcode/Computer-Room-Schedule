import axios from "./axios";
import removeAccents from "../utils/removeAccents";

const semesterAPI = {
  getAllWithoutParams: async () => {
    const access_token = await localStorage.getItem("access_token");
    
  
    const url = "/semester/get-all";
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    return response;
  },

  getAllByDate: async (params) => {

    const access_token = await localStorage.getItem("access_token");
    
    const url = "/semester/get-all";
    const response = await axios.get(url, {
      params,
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    return response;
  },

  getAll: async (params) => {
    
  
    
      params.filter = "is_active:eq:" + params.is_active;
      delete params.is_active;
    
    

    if (params.search !== "") {
      params.search = removeAccents(params.search);
      params.filter = params.filter + ",name:like:" + params.search;
    }

    const access_token = await localStorage.getItem("access_token");
    
    delete params.search;
    const url = "/semester/get-all";
    const response = await axios.get(url, {
      params,
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    return response;
  },

  create: async (data) => {
    const url = "/semester/create";
    const access_token = await localStorage.getItem("access_token");
    const response = await axios.post(url, data, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    
    return response;
  },

  update: async (id, data) => {
    const url = `/semester/update/${id}`;
    const access_token = await localStorage.getItem("access_token");
    const response = await axios.patch(url, data, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    return response;
  },

  updateMany: async (data) => {
    const url = "/semester/update-many";
    const access_token = await localStorage.getItem("access_token");
    const response = await axios.patch(url, data, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    return response;
  },
};
export default semesterAPI;
