import axios from "axios";

const rooms = [
    {
        id: 1,
        name: "2B11",
        
    },
    {
        id: 2,
        name: "2B21",
    },
    {
        id: 3,
        name: "2B31",
    },
];

const roomAPI = {
    getAllRoom : async (params)  => {
        const response = {data: rooms};
        return response; 
    }
};
export default roomAPI;