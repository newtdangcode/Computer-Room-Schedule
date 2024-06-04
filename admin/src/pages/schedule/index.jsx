import PageLayout from "../../components/layout/pageLayout";
import ScheduleTable from "../../components/schedule/scheduleTable";
import React, { useState, useEffect } from "react";
import semesterAPI from "../../api/semesterAPI";
import roomAPI from "../../api/roomAPI";
import { useSelector } from "react-redux";

export default function Schedule() {
  const [rooms, setRooms] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [currentSemester, setCurrentSemester] = useState(null);
  const [currentWeek, setCurrentWeek] = useState(0);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const currentUser = useSelector((state) => state.auth.currentUser);
  const [toDay, setToDay] = useState(new Date().toISOString().split('T')[0]);

  const [isloading, setIsLoading] = useState(true);

  const handlePreviousWeek = () => {
    if (currentWeek > 0) {
      setCurrentWeek(currentWeek - 1);
    }
  };

  const handleNextWeek = () => {
    if (endDate && new Date(endDate) < new Date(currentSemester.end_time)) {
      setCurrentWeek(currentWeek + 1);
    }
  };

  const getAllSemester = async () => {
    const response = await semesterAPI.getAllWithoutParams();
    setSemesters(response.data);
    if (!currentSemester) {
      response.data.forEach((item) => {
        if (item.start_time <= toDay && toDay <= item.end_time) {
          setCurrentSemester(item);
        }
      });
    }
  };

  const getCurrentWeek = (semesterStartDate, today) => {
  
  // Xác định ngày đầu tuần (Thứ Hai) của tuần chứa ngày bắt đầu học kỳ
  const dayOfWeek = semesterStartDate.getDay();
  const dayDifference = (dayOfWeek === 0 ? 6 : dayOfWeek - 1);
  const startOfWeek = new Date(semesterStartDate.getTime() - dayDifference * 24 * 60 * 60 * 1000);


  // Tính số ngày từ ngày bắt đầu tuần đến ngày hôm nay
  const daysFromStart = Math.floor((today.getTime() - startOfWeek.getTime()) / (24 * 60 * 60 * 1000));
  // Kiểm tra nếu ngày hôm nay nằm ngoài phạm vi học kỳ
  if (today < semesterStartDate || today > new Date(currentSemester.end_time)) return 0;
  // Tính toán tuần hiện tại
  return Math.floor(daysFromStart / 7) ; // Thêm 1 vì tuần bắt đầu từ 1
};

  const getCurrentWeekDates = (semesterStartDate, currentWeek) => {
    const dayOfWeek = semesterStartDate.getDay();
    const dayDifference = (dayOfWeek === 0 ? 6 : dayOfWeek - 1);
    const start = new Date(semesterStartDate.getTime() - dayDifference * 24 * 60 * 60 * 1000);
    start.setDate(start.getDate() + currentWeek * 7);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    setStartDate(start);
    setEndDate(end);
  };

  const getAllRoom = async () => {
    const response = await roomAPI.getAllWithoutParams();
    setRooms(response.data);
  };
  useEffect(() => {
    if (endDate && startDate) {
      getAllRoom();
      setIsLoading(false);
    }

  }, [endDate, startDate, currentWeek]);
  useEffect(() => {
    if (currentSemester) {
      const semesterStartDate = new Date(currentSemester.start_time);
      setCurrentWeek(getCurrentWeek(semesterStartDate, new Date(toDay)));
    }
  }, [currentSemester]);

  useEffect(() => {
    if (currentSemester) {
      getCurrentWeekDates(new Date(currentSemester.start_time), currentWeek);
     
    }
    
  }, [currentWeek, currentSemester]);

  useEffect(() => {
    getAllRoom();
    getAllSemester();
  }, []);

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    let day = d.getDate();
    let month = d.getMonth() + 1; // Months are zero-based
    const year = d.getFullYear();
    if (day < 10) day = '0' + day;
    if (month < 10) month = '0' + month;
    return `${day}/${month}/${year}`;
  };

  const handleSemesterChange = (e) => {
    const selectedSemesterId = e.target.value;
    const selectedSemester = semesters.find((sem) => sem.id === parseInt( selectedSemesterId));
    if (selectedSemester) {
      setCurrentSemester(selectedSemester);
      setCurrentWeek(0); // Reset to the first week
    }
  };
  

  return (
    <PageLayout title="Thời khoá biểu phòng máy">
      <div className="bg-white rounded-lg ring-1 ring-gray-200 ring-opacity-4 overflow-hidden mb-5 shadow-xs">
        <div className="p-4">
          <div className="py-3 flex gap-4 lg:gap-6 xl:gap-6 md:flex xl:flex">
            <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
              <select
                value={currentSemester?.id || ""}
                onChange={handleSemesterChange}
                className="block w-full h-12 px-2 py-1 text-sm focus:outline-none leading-5 rounded-md focus:border-gray-200 border-gray-200 bg-gray-100 ring-1 ring-gray-200 focus:bg-white border-transparent form-select"
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
          <button
            className={`px-4 py-2 font-bold text-white rounded ${currentWeek > 0 ? "bg-primary hover:bg-red-800" : "bg-red-400 cursor-not-allowed"}`}
            onClick={handlePreviousWeek}
          >
            Tuần Trước
          </button>
          <div>
            <p className="text-lg font-semibold">
              Tuần: {currentWeek + 1} [{formatDate(startDate)} - {formatDate(endDate)}]
            </p>
          </div>
          <button
            className={`px-4 py-2 font-bold text-white rounded ${endDate && new Date(endDate) < new Date(currentSemester?.end_time) ? "bg-primary hover:bg-red-800" : "bg-red-400 cursor-not-allowed"}`}
            onClick={handleNextWeek}
          >
            Tuần sau
          </button>
        </div>
        {isloading
        ? <p>Loading...</p>
        :(
          rooms.length > 0 &&
            rooms.map((item) => (
              <ScheduleTable key={item.id} room={item} startDate={startDate} endDate={endDate} currentUser={currentUser} />
            ))
        )}
        
      </div>
    </PageLayout>
  );
}
