import axios from "axios";

const scheduleStatus=[
    {
    id: 1,
    name: "Chờ xác nhận"
    },
    {
    id: 2,
    name: "Đã xác nhận"
    },
    {
    id: 3,
    name: "Đã Từ chối"
    },
];

const scheduleStatusAPI = {
    getAllScheduleStatus: async(params) => {
        const response = {data: scheduleStatus};
        return response;
    },
};

export default scheduleStatusAPI;