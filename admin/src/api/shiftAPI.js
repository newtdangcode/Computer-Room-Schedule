import axios from "axios";

const shifts=[
    {
     id: 1,
    name: "Sáng"
    },
    {
     id: 2,
    name: "Chiều"
    }
];

const shiftAPI = {
    getAllShifts : async(params) => {
        const response = {data: shifts};
        return response;
    }
};

export default shiftAPI;