import axios from "axios";
import React, {useState, useEffect} from "react";
import shiftAPI from "./shiftAPI";
import semesterAPI from "./semesterAPI";
import scheduleStatusAPI from "./scheduleStatusAPI";
import roomAPI from "./roomAPI";
const schedules = [
    {
      id: 1,
      room_id: 1,
      date: '04/22/2024',
      shift_id: 1,
      lecturer: 'Trần Văn A',
      subject: 'Hệ điều hành',
      status_id: 1,
      semester_id: 2,
    },
    {
      id: 2,
      room_id: 1,
      date: '04/23/2024',
      shift_id: 2,
      lecturer: 'Nguyễn Thị B',
      subject: 'Lập trình Java',
      status_id: 2,
      semester_id: 2,
    },
    {
      id: 3,
      room_id: 2,
      date: '04/24/2024',
      shift_id: 1,
      lecturer: 'Lê Văn C',
      subject: 'Cơ sở dữ liệu',
      status_id: 1,
      semester_id: 2,
    },
    {
      id: 4,
      room_id: 2,
      date: '04/24/2024',
      shift_id: 2,
      lecturer: 'Phạm Thị D',
      subject: 'Mạng máy tính',
      status_id: 2,
      semester_id: 2,
    },
    {
      id: 5,
      room_id: 3,
      date: '04/26/2024',
      shift_id: 1,
      lecturer: 'Hoàng Văn E',
      subject: 'Hệ thống thông tin',
      status_id: 1,
      semester_id: 2,
    },
    {
      id: 6,
      room_id: 1,
      date: '04/26/2024',
      shift_id: 2,
      lecturer: 'Vũ Thị F',
      subject: 'Phân tích thiết kế hệ thống',
      status_id: 2,
      semester_id: 2,
    },
    {
      id: 7,
      room_id: 2,
      date: '04/29/2024',
      shift_id: 1,
      lecturer: 'Đỗ Văn G',
      subject: 'Toán rời rạc',
      status_id: 1,
      semester_id: 2,
    },
    {
      id: 8,
      room_id: 3,
      date: '04/29/2024',
      shift_id: 2,
      lecturer: 'Mai Thị H',
      subject: 'Tính toán đa phương tiện',
      status_id: 2,
      semester_id: 2,
    },
    {
      id: 9,
      room_id: 2,
      date: '04/30/2024',
      shift_id: 1,
      lecturer: 'Lê Minh I',
      subject: 'Kiến trúc máy tính',
      status_id: 1,
      semester_id: 2,
    },
    {
      id: 10,
      room_id: 2,
      date: '05/01/2024',
      shift_id: 2,
      lecturer: 'Nguyễn Văn K',
      subject: 'Tư duy thuật toán',
      status_id: 2,
      semester_id: 2,
    },
    // Thêm dữ liệu cho các lịch học khác
  ];
//const [roomSchedules, setRoomSchedules] = useState([]);
//const [currentSchedule, setCurrentSchedule] = useState([]);
const scheduleAPI = {
    getAllSchedule: async(params) => {
        const rooms = (await roomAPI.getAllRoomforShedule()).data;
        console.log(rooms);
        const currentWeek = params.currentWeek;
        console.log(params);
        const semesterParams = params.currentSemester;
        const semester = await semesterAPI.getOneSemester(parseInt(semesterParams));
        //console.log(semester);
        
        if (semester && semester.start_time) {
          const startDate = semester.start_time;
         ;
        //console.log(startDate);
        const startDateArray = startDate.split('/');
        const startDateObject = new Date(startDateArray[2], startDateArray[0] - 1, startDateArray[1]);
        
        
        const currentStartDate = new Date(startDateObject);

        //const currentStartDate = new Date(startDate);
        currentStartDate.setDate(startDateObject.getDate() + (currentWeek * 7));
        var updatedSchedule=[];
      
        schedules.map((item) => {
        const currentDate = new Date(item.date);
        const weekStartDate = new Date(currentStartDate);
        weekStartDate.setHours(0, 0, 0, 0);
        const weekEndDate = new Date(weekStartDate);
        weekEndDate.setDate(weekEndDate.getDate() + 6);
        //console.log(weekStartDate,'-',currentDate,'-',weekEndDate,currentDate.getTime() >= weekStartDate.getTime() && currentDate.getTime() <= weekEndDate.getTime());
        if(currentDate.getTime() >= weekStartDate.getTime() && currentDate.getTime() <= weekEndDate.getTime()) {
            updatedSchedule.push(item);
        }
        }); 
        //console.log(updatedSchedule);
        const currentSchedule = updatedSchedule;
        //const response = {schedules: updatedSchedule, currentStartDate: currentStartDate}; 
        //return response;
        //   async function updateRoomSchedules() {
        let roomSchedules=[];
        if (rooms.length > 0) {
        const arrayRoomSchedules = [];
        
        // Sử dụng Promise.all để chờ tất cả các hoạt động bất đồng bộ hoàn thành
        await Promise.all(rooms.map(async (room) => {
          const schedule = [];
          // Lọc các lịch trình cho phòng hiện tại
          currentSchedule?.forEach((item) => {
            if (item.room_id === room.id) {
              schedule.push(item);
            }
          });
    
          // Tạo đối tượng mới chứa thông tin về phòng và lịch trình của nó
          const updatedRoomSchedules = {
            room_id: room.id,
            schedules: schedule,
          };
          // Thêm đối tượng mới vào mảng arrayRoomSchedules
          arrayRoomSchedules.push(updatedRoomSchedules);
        }));
    
        // Cập nhật state roomSchedules với mảng mới
        //setValueForRoomSchedules(arrayRoomSchedules);
        roomSchedules = arrayRoomSchedules;
    //   console.log(arrayRoomSchedules);
        
        // Kiểm tra giá trị mới của roomSchedules
        
      }
      const response = {roomSchedules: roomSchedules, currentStartDate: currentStartDate}; 
      //console.log(response);
        return response;
    
    // Gọi hàm updateRoomSchedules để cập nhật roomSchedules
     //updateRoomSchedules();
      } else {
        return "";
          // Xử lý trường hợp semester không hợp lệ
      }
      
        
        
    }
};
export default scheduleAPI;