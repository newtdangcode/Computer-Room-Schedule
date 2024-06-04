import axios from "./axios";

const notificationAPI = {
  getAllNotification: async () => {
    const access_token = await localStorage.getItem("access_token");
    const url = "/notification/get-all";
    const response = await axios.get(url, {
      headers: {
          Authorization: `Bearer ${access_token}`,
      },
  });
  return response;
  },
  updateNotification: async (id) => {
    const access_token = await localStorage.getItem("access_token");
    const url = `/notification/update/${id}`;
    const data={};
    const response = await axios.patch(url, data,{
      headers: {
          Authorization: `Bearer ${access_token}`,
      },
  });
    return response;
  },
};

export default notificationAPI;
