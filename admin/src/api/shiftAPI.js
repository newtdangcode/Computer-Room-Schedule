import axios from "./axios";



const shiftAPI = {
   getAll: async (params) => {
      const access_token = await localStorage.getItem("access_token");
      const url = "/shift/get-all";
      const response = await axios.get(url, {
         params,
         headers: {
            Authorization: `Bearer ${access_token}`,
         },
      });
      return response;
   },
};

export default shiftAPI;