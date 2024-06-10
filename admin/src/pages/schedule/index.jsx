import PageLayout from "../../components/layout/pageLayout";
import ScheduleTable from "../../components/schedule/scheduleTable";
import React, { useState, useEffect } from "react";
import semesterAPI from "../../api/semesterAPI";
import roomAPI from "../../api/roomAPI";
import { useSelector } from "react-redux";
import { set } from "react-hook-form";
import { IconNext, IconPrevious } from "../../components/icon";

export default function Schedule() {
  const [weeks, setWeeks] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [currentSemester, setCurrentSemester] = useState(null);
  const [currentWeek, setCurrentWeek] = useState(0);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const currentUser = useSelector((state) => state.auth.currentUser);
  const [toDay, setToDay] = useState(new Date().toISOString().split("T")[0]);

  const [isloading, setIsLoading] = useState(true);
  const getAllWeeks = (semesterStartDate, semesterEndDate) => {
    const dayOfWeek = semesterStartDate.getDay();
    const dayDifference = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const startOfWeek = new Date(semesterStartDate.getTime() - dayDifference * 24 * 60 * 60 * 1000);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);

    const weeks = [];
    const semesterEndDatetemp = new Date(semesterEndDate);
    semesterEndDatetemp.setDate(semesterEndDatetemp.getDate() + 7);

    while (endOfWeek < semesterEndDatetemp) {
      weeks.push({ start: new Date(startOfWeek), end: new Date(endOfWeek), weekNumber: weeks.length + 1 });
      startOfWeek.setDate(startOfWeek.getDate() + 7);
      endOfWeek.setDate(endOfWeek.getDate() + 7);
    }
    setWeeks(weeks);
  };
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
    const dayDifference = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const startOfWeek = new Date(semesterStartDate.getTime() - dayDifference * 24 * 60 * 60 * 1000);

    // Tính số ngày từ ngày bắt đầu tuần đến ngày hôm nay
    const daysFromStart = Math.floor((today.getTime() - startOfWeek.getTime()) / (24 * 60 * 60 * 1000));
    // Kiểm tra nếu ngày hôm nay nằm ngoài phạm vi học kỳ
    if (today < semesterStartDate || today > new Date(currentSemester.end_time)) return 0;
    // Tính toán tuần hiện tại
    return Math.floor(daysFromStart / 7)+1; // Thêm 1 vì tuần bắt đầu từ 1
  };

  const getCurrentWeekDates = (semesterStartDate, currentWeek) => {
    const dayOfWeek = semesterStartDate.getDay();
    const dayDifference = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const start = new Date(semesterStartDate.getTime() - dayDifference * 24 * 60 * 60 * 1000);
    start.setDate(start.getDate() + (currentWeek-1) * 7);
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
    getAllWeeks(new Date(currentSemester?.start_time), new Date(currentSemester?.end_time));
  }, [currentSemester]);
  useEffect(() => {
    getAllRoom();
    getAllSemester();
  }, [weeks]);

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    let day = d.getDate();
    let month = d.getMonth() + 1; // Months are zero-based
    const year = d.getFullYear();
    if (day < 10) day = "0" + day;
    if (month < 10) month = "0" + month;
    return `${day}/${month}/${year}`;
  };

  const handleSemesterChange = (e) => {
    const selectedSemesterId = e.target.value;
    const selectedSemester = semesters.find((sem) => sem.id === parseInt(selectedSemesterId));
    if (selectedSemester) {
      setCurrentSemester(selectedSemester);
      setCurrentWeek(0); // Reset to the first week
    }
  };

  return (
    <PageLayout title="Thời khoá biểu phòng máy">
      {currentUser.account_id.role_id.id === 4 ? null : (
        <div className="bg-white rounded-lg ring-1 ring-gray-200 ring-opacity-4 overflow-hidden mb-5 shadow-xs">
          {currentUser.account_id.role_id.id === 3 ? (
            <div className="w-[100%]">
              <div className="p-4 flex justify-around">
                <div className="flex justify-center items-center text-center">
                  <div className="mr-2 h-[40px] w-[40px] bg-white border-[1px] border-gray-[800] rounded-lg"></div>
                  <div> còn trống</div>
                </div>

                <div className="flex justify-center items-center text-center">
                  <div className="mr-2 h-[40px] w-[40px] bg-orange-200 border-[1px] border-gray-[800] rounded-lg"></div>
                  <div> Đang chờ duyệt (của tôi)</div>
                </div>

                <div className="flex justify-center items-center text-center">
                  <div className="mr-2 h-[40px] w-[40px] bg-gray-300 border-[1px] border-gray-[800] rounded-lg"></div>
                  <div> Đang chờ duyệt (người khác)</div>
                </div>

                <div className="flex justify-center items-center text-center">
                  <div className="mr-2 h-[40px] w-[40px] bg-red-200 border-[1px] border-gray-[800] rounded-lg"></div>
                  <div> Đã được duyệt (người khác)</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-[50%]">
              <div className="p-4 flex justify-around">
                <div className="flex justify-center items-center text-center">
                  <div className="mr-2 h-[40px] w-[40px] bg-white border-[1px] border-gray-[800] rounded-lg"></div>
                  <div> còn trống</div>
                </div>

                <div className="flex justify-center items-center text-center">
                  <div className="mr-2 h-[40px] w-[40px] bg-gray-300 border-[1px] border-gray-[800] rounded-lg"></div>
                  <div> Đang chờ duyệt</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="bg-white rounded-lg ring-1 ring-gray-200 ring-opacity-4 overflow-hidden mb-2 shadow-xs">
        <div className="p-4">
          <div className="py-1 flex gap-4 lg:gap-6 xl:gap-6 md:flex xl:flex">
            <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
              <select
                value={currentSemester?.id || ""}
                onChange={handleSemesterChange}
                className="block w-full h-10 px-2 py-1 text-sm focus:outline-none leading-5 rounded-md focus:border-gray-200 border-gray-200 bg-gray-100 ring-1 ring-gray-200 focus:bg-white border-transparent form-select"
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

      <div className="container mx-auto">
        <div className="w-full flex justify-between items-center mb-2">
          <div className="w-full bg-white rounded-lg ring-1 ring-gray-200 ring-opacity-4 overflow-hidden mb-1 shadow-xs">
            <div className="px-4 py-1">
              <div className="py-1 flex gap-4 lg:gap-6 xl:gap-6 md:flex xl:flex">
                <button
                  className={`flex justify-center items-center text-center w-[15%] px-4 py-2 font-bold text-white rounded ${
                    currentWeek > 0 ? "bg-primary hover:bg-red-800" : "bg-red-400 cursor-not-allowed"
                  }`}
                  onClick={handlePreviousWeek}
                >
                  <span className="mr-3">
                    <IconPrevious/>
                  </span>
                  Tuần Trước
                </button>
                <div className="w-70% flex justify-center items-center flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
                  <select
                    className="flex justify-center items-center text-center w-[50%] h-10 px-2 py-1 text-sm focus:outline-none leading-5 rounded-md focus:border-gray-200 border-gray-200 bg-gray-100 ring-1 ring-gray-200 focus:bg-white border-transparent form-select"
                    onChange={(e) => {
                      setCurrentWeek(parseInt(e.target.value));
                    }}
                    name="currentweek"
                    id="currentweek"
                    value={currentWeek}
                  >
                    {weeks.map((week) => (
                      <option key={week.weekNumber} value={week.weekNumber}>
                        Tuần {week.weekNumber} [ {formatDate(week.start)} - {formatDate(week.end)} ]
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  className={`flex justify-center items-center text-center w-[15%] px-4 py-2 font-bold text-white rounded ${
                    endDate && new Date(endDate) < new Date(currentSemester?.end_time)
                      ? "bg-primary hover:bg-red-800"
                      : "bg-red-400 cursor-not-allowed"
                  }`}
                  onClick={handleNextWeek}
                >
                  Tuần sau
                  <span className="ml-3">
                    <IconNext/>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className={`${currentUser.account_id.role_id.id === 4 ? "h-[440px]" : "h-[350px]"} overflow-y-auto`}>
          {isloading ? (
            <p>Loading...</p>
          ) : (
            rooms.length > 0 &&
            rooms.map((item) => (
              <ScheduleTable
                key={item.id}
                room={item}
                startDate={startDate}
                endDate={endDate}
                currentUser={currentUser}
              />
            ))
          )}
        </div>
      </div>
    </PageLayout>
  );
}
