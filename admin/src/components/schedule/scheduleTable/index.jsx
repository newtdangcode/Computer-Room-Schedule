// File: ScheduleTable.js
import React, { useEffect, useState } from 'react';
import roomAPI from '../../../api/roomAPI';
export default function ScheduleTable ({ room_id, schedule }){
  const [rooms, setRooms] = useState([]);
  const [title,setTitle] = useState("");
  const getRoom = async() => {
    const str = await rooms?.find((item)=>item.id==room_id)?.name;
    setTitle(str);
  }
  useEffect(()=>{
    getRoom();
   },[rooms]);
  useEffect(()=>{
    getAllRoomforShedule();
    
   },[]);
  const getAllRoomforShedule = async () => {
    const response = await roomAPI.getAllRoomforShedule();
    setRooms(response.data);
    
    //console.log(response.data);
  };
  const daysOfWeek = ['Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy', 'Chủ Nhật'];
 
const getScheduleForDay = (day, shift) => {
    const found = schedule.find(item => {
      const [dayOfMonth, month, year] = item.date.split('/').map(Number);
      const currentDate = new Date(year, month - 1, dayOfMonth); // Month in JavaScript starts from 0 (January is 0)
      return currentDate.getDay() === daysOfWeek.indexOf(day) && item.shift_id === shift;
    });
    return found ? (
      <div className="w-full h-full text-start">
        <div className="w-full text-start font-bold">{found.subject}</div>
        <div className="w-full text-start flex">
          <div className="font-bold w-20%">GV: </div>
          <div className="w-80% pl-[5px]"> {found.lecturer}</div>
        </div>
      </div>
    ): '';
  };
  

  return (
    <div className="overflow-x-auto">
      
      <table className="w-full text-[13px] border-collapse h-[200px] mb-5 rounded-lg" >
        <thead className="w-full h-[30px] bg-primary text-white">
          
          <tr className="w-full h-[30px] text-[15px]">
            <th className=" w-[9%] text-primary bg-white">Phòng {title}</th>
            {daysOfWeek.map((day, index) => (
              <th key={index} className="border border-gray-400 w-[13%]">
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="w-full h-auto">
          <tr className="w-full  h-[80px] ">
            <td className="border border-gray-400 w-[9%] items-center text-center font-bold bg-primary text-white text-[15px]">Sáng</td>
            {daysOfWeek.map((day, index) => (
              <td key={index} className="border border-gray-400 w-[13%] px-[5px] py-[5px]">
                {getScheduleForDay(day, 1)}
              </td>
            ))}
          </tr>
          <tr className="w-full  h-[80px]">
            <td className="border border-gray-400 w-[9%] items-center text-center font-bold bg-primary text-white text-[15px]">Chiều</td>
            {daysOfWeek.map((day, index) => (
              <td key={index} className="border border-gray-400 w-[13%] px-[5px] py-[5px]">
                {getScheduleForDay(day, 2)}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

