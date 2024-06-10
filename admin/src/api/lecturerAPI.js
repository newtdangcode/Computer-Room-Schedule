import removeAccents from "../utils/removeAccents";
import axios from "./axios";

const lecturerAPI={
  getAllWithoutParams: async () => {
    const access_token = await localStorage.getItem("access_token");
    
  
    const url = "/lecturer/get-all";
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    return response;
  },

  getAll: async (params) => {
    
   
    params.filter = "is_active:eq:" + params.is_active;
    
   // console.log(params.is_active);
    if(params.search!==""){
      params.search = removeAccents(params.search);
      params.filter = params.filter + ",last_name:like:" + params.search;
    }
   
    const access_token = await localStorage.getItem('access_token');
    delete params.is_active;
    delete params.search;
    const url = "/lecturer/get-all";
    const response = await axios.get(url, {
      params, 
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    });
    
    return response;
  },
  
  create: async (data) => {
    const url = "/lecturer/create";
    const access_token = await localStorage.getItem('access_token');
    
   
      const response = await axios.post(url, data, {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      });
      
      return response; 
  },

  createMany: async (data) => {
    const url = "/lecturer/create-many";
    const access_token = await localStorage.getItem('access_token');
    
   
      const response = await axios.post(url, data, {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      });
      
      return response; 
  },

  update: async (code, data) => {
    const url = `/lecturer/update/${code}`;
    const access_token = await localStorage.getItem('access_token');
   
    const response = await axios.patch(url, data, {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    });
    return response;
  },
  
  updateMany: async (data) => {
    const url = "/lecturer/update-many";
    const access_token = await localStorage.getItem('access_token');
    const response = await axios.patch(url, data, {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    });
    return response;
  },
}
export default lecturerAPI;