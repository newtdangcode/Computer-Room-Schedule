import removeAccents from "../utils/removeAccents";
import axios from "./axios";

const studentAPI={
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
    
   if(params.is_active!==undefined){
    params.filter = "is_active:eq:" + params.is_active;
   }else{
    params.filter = "is_active:eq:true";
   }
   // console.log(params.is_active);
    if(params.search!==""&&params.search!==undefined){
      params.search = removeAccents(params.search);
      params.filter = params.filter + ",last_name:like:" + params.search;
    }
    if(params.class_code!==""&&params.class_code!==undefined){
      params.filter = params.filter + ",class_code.code:eq:" + params.class_code;
    }
   
    const access_token = await localStorage.getItem('access_token');
    delete params.is_active;
    delete params.search;
    delete params.class_code;
    const url = "/student/get-all";
    //console.log(params);
    const response = await axios.get(url, {
      params, 
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    });
    
    return response;
  },
  
  getOne: async (code) => {
    const url = `/student/get-one/${code}`;
    const access_token = await localStorage.getItem('access_token');
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    });
    return response;
  },

  getMany: async (data) => {
    const url = '/student/get-many';
    const access_token = await localStorage.getItem('access_token');
    const response = await axios.post(url, data,{
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