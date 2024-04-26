import axios from "axios";

const semesters= [
    {
        id:1,
        name:"Học Kỳ 2 năm học 2022-2023",
        start_time: '08/15/2023',
        end_time: '11/24/2023'
    },
    {
    id:2,
    name:"Học Kỳ 2 năm học 2023-2024",
    start_time: '04/15/2024',
    end_time: '06/24/2024'
    },
    {
    id:3,
    name:"Học Kỳ 1 năm học 2024-2025",
    start_time: '08/15/2024',
    end_time: '11/24/2024'
    }
];
const semesterAPI = {
    getAllSemester: async(params) => {
        const response = {data: semesters};
        return response;
    },
    getOneSemester: async(id) => {
        let response;
        semesters.map((item) => {
            if(item.id === id){
                response = item;
            }
        });
        return response;
    },
};
export default semesterAPI;