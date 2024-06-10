import React, { useEffect, useState } from "react";
import roomAPI from "../../../api/roomAPI";
export default function ScheduleTable({ room, startDate, endDate, currentUser }) {
  const [title, setTitle] = useState(room.name);
  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    getSchedule();
  }, [startDate, endDate]);
  const getSchedule = async () => {
    try {
      let response;
      switch (currentUser.account_id.role_id.id) {
        case 1:
        case 2:
          response = await roomAPI.getScheduleInWeekByRoom(room.code, {
            start_time: new Date(startDate).toISOString().split("T")[0],
            end_time: new Date(endDate).toISOString().split("T")[0],
          });
          setSchedules(response.bookings);
          break;
        case 3:
          response = await roomAPI.getScheduleInWeekByRoom(room.code, {
            start_time: new Date(startDate).toISOString().split("T")[0],
            end_time: new Date(endDate).toISOString().split("T")[0],
          });
          setSchedules(response.bookings);
          // response = await roomAPI.getScheduleInWeekByRoomLecturer(room.code, currentUser.code, {start_time: new Date(startDate).toISOString().split('T')[0], end_time: new Date(endDate).toISOString().split('T')[0]});
          // setSchedules(response.bookings);
          break;
        case 4:
          response = await roomAPI.getScheduleInWeekByRoomStudent(room.code, currentUser.code, {
            start_time: new Date(startDate).toISOString().split("T")[0],
            end_time: new Date(endDate).toISOString().split("T")[0],
          });
          setSchedules(response.bookings);
          break;
      }
    } catch (error) {
      console.error("Failed to fetch schedule: ", error);
    }
  };

  const daysOfWeek = ["Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy", "Chủ Nhật"];

  const getScheduleForDay = (day, shift) => {
    const found = schedules?.find((item) => {
      const localDate = new Date(item.date);
      const date = localDate.toLocaleDateString("en-CA"); // 'en-CA' định dạng ngày theo chuẩn "yyyy-mm-dd"
      item.date = date;
      const index = localDate.getDay() != 0 ? localDate.getDay() - 1 : 6;
      return index === daysOfWeek.indexOf(day) && item.shift_id.id === shift;
    });
    //console.log(found, day, shift);
    return found ? (
      <>
        {currentUser.account_id.role_id.id === 3 ? (
          <>
            {found.status_id.id === 1 ? (
              <div className={`w-full h-full text-[15px] font-[600] text-black flex text-center justify-center items-center ${found.lecturer_code.code === currentUser.code ? "bg-orange-200" : "bg-gray-300"}`}>
                
              </div>
            ) : (
              <>
                {found.lecturer_code.code === currentUser.code ? (
                  <div className="w-full h-full text-start py-4 px-2">
                    <div className="w-full text-start font-bold">
                      {found.subject_id.name} ({found.subject_id.code})
                    </div>
                    <div className="w-full text-start flex">
                      <div className="font-bold w-20%">GV:</div>
                      <div className="w-80% pl-[5px]">
                        {found.lecturer_code.first_name} {found.lecturer_code.last_name}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full text-[15px] font-[600] text-black bg-red-200 flex text-center justify-center items-center">
                    
                  </div>
                )}
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full">
            {found.status_id.id === 2 ? (
              <div className="w-full h-full text-start py-4 px-2">
                <div className="w-full text-start font-bold">
                  {found.subject_id.name} ({found.subject_id.code})
                </div>
                <div className="w-full text-start flex">
                  <div className="font-bold w-20%">GV:</div>
                  <div className="w-80% pl-[5px]">
                    {found.lecturer_code.first_name} {found.lecturer_code.last_name}
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full h-full text-[15px] font-[600] text-black bg-gray-300 flex text-center justify-center items-center">
                                ({found.lecturer_code.first_name} {found.lecturer_code.last_name})
              </div>
            )}
          </div>
        )}
      </>
    ) : null;
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-[13px] border-collapse h-[200px] mb-3 rounded-lg">
        <thead className="w-full h-[30px] bg-primary text-white">
          <tr className="w-full h-[30px] text-[15px]">
            <th className=" w-[9%] text-primary bg-white">Phòng {room.name}</th>
            {daysOfWeek.map((day, index) => (
              <th key={index} className="border border-gray-400 w-[13%]">
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="w-full h-[280px]">
          <tr className="w-full  h-[140px] ">
            <td className="border border-gray-400 w-[9%] items-center text-center font-bold bg-primary text-white text-[15px]">
              Sáng
            </td>
            {daysOfWeek.map((day, index) => (
              <td key={index} className="border border-gray-400 w-[13%] ">
                {getScheduleForDay(day, 1)}
              </td>
            ))}
          </tr>
          <tr className="w-full  h-[140px]">
            <td className="border border-gray-400 w-[9%] items-center text-center font-bold bg-primary text-white text-[15px]">
              Chiều
            </td>
            {daysOfWeek.map((day, index) => (
              <td key={index} className="border border-gray-400 w-[13%] ">
                {getScheduleForDay(day, 2)}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
