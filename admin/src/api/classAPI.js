import axios from "./axios";
const sampleStudents = [
    { 
        id: 1,
        name: "D21CQAT01-N"
    },
    {
        id: 2,
        name: "D21CQCN02-N"
    },
    {
        id: 3,
        name: "D21CQPT03-N"
    }

];
const classAPI = {
    getAllClass: async (params) => {
        const response = {data: sampleStudents};
        return response;
    }
};
export default classAPI;