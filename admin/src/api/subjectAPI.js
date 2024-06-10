import axios from "./axios";
import removeAccents from "../utils/removeAccents";

const subjectAPI = {
  getAllWithoutParams: async () => {
    const access_token = await localStorage.getItem("access_token");
    
  
    const url = "/subject/get-all";
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    return response;
  },

  getAllBySemesterAndLecturer: async (params) => {
    const access_token = await localStorage.getItem("access_token");
    
    const url = "/subject/get-all";
    const response = await axios.get(url, {
      params,
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
    if(params.currentUser.account_id.role_id.id === 3){
      params.filter = params.filter + ",lecturer_code.code:eq:" + params.currentUser.code;
    }

    if (params.search !== "") {
      params.search = removeAccents(params.search);
      params.filter = params.filter + ",name:like:" + params.search;
    }

    const access_token = await localStorage.getItem("access_token");
    
    delete params.search;
    const url = "/subject/get-all";
    const response = await axios.get(url, {
      params,
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    return response;
  },

  getSubjectStudentList: async (id) => {
    const url = `/subject/get-one/${id}`;
    const access_token = await localStorage.getItem("access_token");
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    return response;
  },
  
  addStudentsToSubject: async (id, data) => {
    const url = `/subject/add-students-to-subject/${id}`;
    const access_token = await localStorage.getItem("access_token");
    const response = await axios.patch(url, data, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    return response;
  },

  create: async (data) => {
    const url = "/subject/create";
    const access_token = await localStorage.getItem("access_token");

    const response = await axios.post(url, data, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    console.log(response);
    return response;
  },

  createMany: async (data) => {
    const url = "/subject/create-many";
    const access_token = await localStorage.getItem("access_token");

    const response = await axios.post(url, data, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    console.log(response);
    return response;
  },

  update: async (id, data) => {
    const url = `/subject/update/${id}`;
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
    const url = "/subject/update-many";
    const access_token = await localStorage.getItem("access_token");
    const response = await axios.patch(url, data, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    return response;
  },
};
export default subjectAPI;
