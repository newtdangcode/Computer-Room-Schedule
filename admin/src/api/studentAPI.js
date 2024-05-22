import removeAccents from "../utils/removeAccents";
import axios from "./axios";

const studentAPI={
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
    const url = "/student/get-all";
    const response = await axios.get(url, {
      params, 
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    });
    
    return response;
  },
  
    
  create: async (data) => {
    const url = "/student/create";
    const access_token = await localStorage.getItem('access_token');
    //console.log(access_token);
   
      const response = await axios.post(url, data, {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      });
     
      return response; 
  },

  update: async (code, data) => {
    const url = `/student/update/${code}`;
    const access_token = await localStorage.getItem('access_token');
  
    const response = await axios.patch(url, data, {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    });
    return response;
  },
  
  updateMany: async (data) => {
    const url = "/student/update-many";
    const access_token = await localStorage.getItem('access_token');
    const response = await axios.patch(url, data, {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    });
    return response;
  },
}
export default studentAPI;