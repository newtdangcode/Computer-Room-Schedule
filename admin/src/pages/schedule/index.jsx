import PageLayout from "../../components/layout/pageLayout";
import ScheduleTable from "../../components/schedule/scheduleTable";
import React, { useState, useEffect } from "react";
import scheduleAPI from "../../api/scheduleAPI";
import semesterAPI from "../../api/semesterAPI";
import roomAPI from "../../api/roomAPI";
import { get } from "react-hook-form";
import Semester from "../semester";
export default function Schedule() {
  const [roomSchedules, setRoomSchedules] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [currentSemester, setCurrentSemester] = useState();
  const [currentWeek, setCurrentWeek] = useState(0);
  const [currentStartDate, setCurrentStartDate] = useState();

  const handlePreviousWeek = () => {
    if(currentWeek>0){setCurrentWeek(currentWeek - 1)}
  };

  const handleNextWeek = () => {
    setCurrentWeek(currentWeek + 1);
  };

  
  const getAllSemester = async () => {
    const response = await semesterAPI.getAllSemester();
    setSemesters(response.data);
    if (currentSemester == null) {
      setCurrentSemester(response.data[0].id);
    }
  };
  const getAllSchedule = async () => {
    let params = {};
    params.currentSemester = currentSemester;
    params.currentWeek = currentWeek;
    const response = await scheduleAPI.getAllSchedule(params);
    setRoomSchedules(response.roomSchedules);
    setCurrentStartDate(response.currentStartDate);
    //console.log(response);
  };
  
  useEffect(()=>{
    setCurrentWeek(0);
  },[currentSemester])
  useEffect(() => {
    getAllSemester();
    //getAllRoom();
  },[]);
  useEffect(() => {
    getAllSchedule();
  }, [currentWeek, currentSemester]);

  return (
    <PageLayout title="Thời khoá biểu phòng máy">
      <div className="bg-white rounded-lg ring-1 ring-gray-200 ring-opacity-4 overflow-huser_idden mb-5 shadow-xs">
        <div className="p-4">
          <div className="py-3 flex gap-4 lg:gap-6 xl:gap-6 md:flex xl:flex">
            <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow ">
              <select
                defaultValue={currentSemester}
                onChange={(e) => setCurrentSemester(e.target.value)}
                className="block w-full h-12 px-2 py-1 text-sm focus:outline-none leading-5 
                        rounded-md focus:border-gray-200 border-gray-200 bg-gray-100 ring-1 ring-gray-200
                        focus:bg-white border-transparent form-select "
              >
                {semesters.map((item) => (
                  <option value={item.id} key={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end mb-5 px-[20px]"></div>

      <div className="container mx-auto">
        <div className="flex justify-between items-center my-4">
          <button className={`px-4 py-2 font-bold text-white rounded  ${currentWeek>0?"bg-primary hover:bg-red-800":"bg-red-400 cursor-not-allowed"}`} onClick={handlePreviousWeek}>
            Tuần Trước
          </button>
          <div>
            <p className="text-lg font-semibold">
              Tuần: {currentWeek + 1} [{currentStartDate ? currentStartDate.toLocaleDateString("en-GB") : ""} -{" "}
              {currentStartDate
                ? new Date(currentStartDate.getTime() + 6 * 24 * 60 * 60 * 1000).toLocaleDateString("en-GB")
                : ""}]
            </p>
          </div>
          <button className="px-4 py-2 font-bold bg-primary text-white rounded hover:bg-red-800" onClick={handleNextWeek}>
            Tuần sau
          </button>
        </div>
        
        {roomSchedules?.length > 0 &&
          roomSchedules.map((item) => <ScheduleTable room_id={item.room_id} schedule={item.schedules} />)}
      </div>
    </PageLayout>
  );
}
