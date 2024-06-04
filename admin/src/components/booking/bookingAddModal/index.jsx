import { useState, useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import Drawer from "../../modal/drawer";
import ModalHeader from "../../modal/header";
import ModalFooter from "../../modal/footer";
import { useForm } from "react-hook-form";
import yup from "../../../utils/yupGlobal";
import toastMessage from "../../../utils/toastMessage";
import styles from "./styles.module.css";
import roomAPI from "../../../api/roomAPI";
import semesterAPI from "../../../api/semesterAPI";
import subjectAPI from "../../../api/subjectAPI";
import lecturerAPI from "../../../api/lecturerAPI";
import shiftAPI from "../../../api/shiftAPI";
import { format, set } from "date-fns";
import { date } from "yup";
import bookingAPI from "../../../api/bookingAPI";
import { useSelector } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import { io } from "socket.io-client";
const socket = io('http://localhost:8080');
export default function AddModalBooking({ closeModal, title, titleBtnFooter, handleAddBooking }) {
  const [dateDefault, setDateDefault] = useState("");
  const [startDate, setStartDate] = useState(new Date(0));
  const [endDate, setEndDate] = useState(new Date(0));
  const [roomSelected, setRoomSelected] = useState("");
  const [semesterSelected, setSemesterSelected] = useState(0);
  const [lecturerSelected, setLecturerSelected] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [shifts, setShifts] = useState([]);
  const currentUser = useSelector((state) => state.auth.currentUser);

  const schema = yup.object().shape({
    room_code: yup.string().required("Vui lòng chọn phòng."),
    date: yup.date().required("Vui lòng chọn ngày."),
    shift_id: yup.number().required("Vui lòng chọn ca."),
    lecturer_code: yup.string().required("Vui lòng chọn giảng viên."),
    semester_id: yup.number().required("Vui lòng chọn đăng ký phòng."),
    subject_id: yup.number().required("Vui lòng chọn môn học."),
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    getAllSemester();
    getAllRooms();
    getAllLecturer();
  }, []);
  useEffect(() => {
    setDateDefault("");
    setValue("date", "");
  }, [semesterSelected, setValue]);
  useEffect(() => {
    if(dateDefault !== "") {
      getAllShifts();
    }
  }, [dateDefault, roomSelected]);
  useEffect(() => {
    if (semesterSelected && lecturerSelected) {
      getAllSubject();
    }
  }, [roomSelected, semesterSelected, lecturerSelected, shifts]);

  const setDate = async (id) => {
    const semester = semesters.find((item) => item.id === parseInt(id));
    await setStartDate(semester.start_time);
    await setEndDate(semester.end_time);
  };

  const getAllShifts = async () => {
    try {
      
      const bookings = await bookingAPI.getManyByRoomDate(roomSelected, dateDefault);
      bookings.map((item) => {
        console.log(item.shift_id.name);
      });
      
      if(bookings.length === 2) {
        setShifts([]);
      }else if(bookings.length === 1) {
        if(bookings[0].shift_id.id === 1 ) {
          setShifts([{id: 2, name: "Chiều"}]);
        }else{
          setShifts([{id: 1, name: "Sáng"}]);
        
        }
      }else{
        setShifts([{id: 1, name: "Sáng"}, {id: 2, name: "Chiều"}]);
      }
      
    } catch (error) {
      console.log(error);
    }
  };

  const getAllRooms = async () => {
    try {
      const response = await roomAPI.getAllWithoutParams();
      setRooms(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getAllLecturer = async () => {
    if(currentUser.account_id.role_id.id === 3) {
      setLecturers([currentUser]);
    }else{
      try {
        const response = await lecturerAPI.getAllWithoutParams();
        setLecturers(response.data);
      } catch (error) {
        console.log(error);
      }
    }
    
  };

  const getAllSemester = async () => {
    try {
      const response = await semesterAPI.getAllWithoutParams();
      setSemesters(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getAllSubject = async () => {
    try {
      const params = {
        filter: `is_active:eq:true,semester_id.id:eq:${semesterSelected},lecturer_code.code:eq:${lecturerSelected}`,
      };
      const response = await subjectAPI.getAllBySemesterAndLecturer(params);
      setSubjects(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      // Chuyển đổi ngày từ input type `date` thành đối tượng `Date` với múi giờ địa phương
      const localDate = new Date(data.date);
      // Format lại ngày thành chuỗi "yyyy-mm-dd"
      data.date = localDate.toLocaleDateString("en-CA"); // 'en-CA' là mã ngôn ngữ và khu vực cho tiêu chuẩn "en-US"

      await handleAddBooking(data);
      if (currentUser.account_id.role_id.id === 3) {
        socket.emit("lecturerBooking", {
          account_id: currentUser.account_id.id,
          content: `${currentUser.first_name} ${currentUser.last_name} đã tạo 1 đăng ký phòng.`
        });
        
      }
      
      toastMessage({ type: "success", message: "Thêm đăng ký phòng thành công." });
      closeModal();
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      console.log(error);
      toastMessage({ type: "error", message: `Thêm đăng ký phòng thất bại. ${errorMessage}.` });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div onClick={closeModal} className={`bg-black/30 top-0 right-0 left-0 w-full h-full fixed `}></div>
      <Drawer closeModal={closeModal} title={title} titleBtnFooter={titleBtnFooter}>
        <ModalHeader closeModal={closeModal} title={title} />
        <div className="h-full overflow-y-scroll grow mt-[20px]">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className={`${styles.item}`}>
              <div className="w-1/3 text-sm text-gray-700 font-medium dark:text-gray-400">
                <label>Chọn học kỳ</label>
              </div>
              <div className="flex flex-col w-2/3">
                <select
                  defaultValue={0}
                  {...register("semester_id")}
                  onChange={(e) => {
                    setSemesterSelected(e.target.value);
                    setDate(e.target.value);
                  }}
                  className="block w-full px-3 py-1 text-sm h-12 rounded-md bg-gray-100 focus:bg-gray-50 border-[1px] focus:bg-transparent focus:outline-none"
                >
                  <option value={0}>Chọn học kỳ</option>
                  {semesters.map((item) => (
                    <option value={parseInt(item.id)} key={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
                {errors.semester_id && <p className="text-red-500 text-sm">{`*${errors.semester_id.message}`}</p>}
              </div>
            </div>

            <div className={`${styles.item}`}>
              <div className="w-1/3 text-sm text-gray-700 font-medium dark:text-gray-400">
                <label>Chọn phòng</label>
              </div>
              <div className="flex flex-col w-2/3">
                <select
                  defaultValue={""}
                  {...register("room_code")}
                  onChange={(e) => setRoomSelected(e.target.value)}
                  className="block w-full px-3 py-1 text-sm h-12 rounded-md bg-gray-100 focus:bg-gray-50 border-[1px] focus:bg-transparent focus:outline-none"
                >
                  <option value="">Chọn phòng</option>
                  {rooms.map((item) => (
                    <option value={item.code} key={item.code}>
                      Phòng - {item.code}
                    </option>
                  ))}
                </select>
                {errors.room_code && <p className="text-red-500 text-sm">{`*${errors.room_code.message}`}</p>}
              </div>
            </div>

            <div className={`${styles.item}`}>
              <div className="w-1/3 text-sm text-gray-700 font-medium dark:text-gray-400">
                <label>Chọn ngày</label>
              </div>
              <div className="flex flex-col w-2/3">
                {semesterSelected !== 0 ? (
                  <input
                    type="date"
                    value={dateDefault}
                    min={new Date(startDate).toISOString().split("T")[0]}
                    max={new Date(endDate).toISOString().split("T")[0]}
                    onChange={(e) => {
                      setValue("date", new Date(e.target.value).toISOString().split("T")[0]);
                      setDateDefault(new Date(e.target.value).toISOString().split("T")[0]);
                    }}
                    className={` ${
                      errors.date ? "border-red-500" : ""
                    } block w-full px-3 py-1 text-sm h-12 rounded-md bg-gray-100 focus:bg-gray-50 border-[1px] focus:bg-transparent focus:outline-none`}
                  />
                ) : (
                  <div className="content-center border-red-500 block w-full px-3 py-1 text-sm text-primary h-12 rounded-md bg-gray-100 focus:bg-gray-50 border-[1px] ">
                    Vui lòng chọn học kỳ!
                  </div>
                )}
                {errors.date && <p className="text-red-500 text-sm">{`*${errors.date.message}`}</p>}
              </div>
            </div>

            <div className={`${styles.item}`}>
              <div className="w-1/3 text-sm text-gray-700 font-medium dark:text-gray-400">
                <label>Chọn ca</label>
              </div>
              <div className="flex flex-col w-2/3">
                {shifts?.length > 0 ? (
                  <select
                    defaultValue={""}
                    {...register("shift_id")}
                    className="block w-full px-3 py-1 text-sm h-12 rounded-md bg-gray-100 focus:bg-gray-50 border-[1px] focus:bg-transparent focus:outline-none"
                  >
                    <option value="">Chọn ca</option>
                    {shifts.map((item) => (
                      <option value={item.id} key={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="content-center border-red-500 block w-full px-3 py-1 text-sm text-primary h-12 rounded-md bg-gray-100 focus:bg-gray-50 border-[1px] ">
                    Không còn ca trống!
                  </div>
                )}

                {errors.shift_id && <p className="text-red-500 text-sm">{`*${errors.shift_id.message}`}</p>}
              </div>
            </div>

            <div className={`${styles.item}`}>
              <div className="w-1/3 text-sm text-gray-700 font-medium dark:text-gray-400">
                <label>Chọn giảng viên</label>
              </div>
              <div className="flex flex-col w-2/3">
                <select
                  defaultValue={""}
                  {...register("lecturer_code")}
                  onChange={(e) => setLecturerSelected(e.target.value)}
                  className="block w-full px-3 py-1 text-sm h-12 rounded-md bg-gray-100 focus:bg-gray-50 border-[1px] focus:bg-transparent focus:outline-none"
                >
                  <option value="">Chọn giảng viên</option>
                  {lecturers.map((item) => (
                    <option value={item.code} key={item.code}>
                      {item.code} - {item.first_name} {item.last_name}
                    </option>
                  ))}
                </select>
                {errors.lecturer_code && <p className="text-red-500 text-sm">{`*${errors.lecturer_code.message}`}</p>}
              </div>
            </div>

            <div className={`${styles.item}`}>
              <div className="w-1/3 text-sm text-gray-700 font-medium dark:text-gray-400">
                <label>Chọn môn học</label>
              </div>
              <div className="flex flex-col w-2/3">
                {semesterSelected === 0 || lecturerSelected === "" ? (
                  <div className="content-center border-red-500 block w-full px-3 py-1 text-sm text-primary h-12 rounded-md bg-gray-100 focus:bg-gray-50 border-[1px] ">
                    Vui lòng chọn học kỳ và giảng viên!
                  </div>
                ) : (
                  <select
                    defaultValue=""
                    {...register("subject_id")}
                    className="block w-full px-3 py-1 text-sm h-12 rounded-md bg-gray-100 focus:bg-gray-50 border-[1px] focus:bg-transparent focus:outline-none"
                  >
                    <option
                      className={semesterSelected === 0 || lecturerSelected === "" ? "text-primary" : ""}
                      value=""
                    >
                      Chọn môn học
                    </option>
                    {subjects.map((item) => (
                      <option value={parseInt(item.id)} key={item.id}>
                        {item.code} - {item.name}
                      </option>
                    ))}
                  </select>
                )}

                {errors.subject_id && <p className="text-red-500 text-sm">{`*${errors.subject_id.message}`}</p>}
              </div>
            </div>
            <div className="flex items-center justify-center  h-[100px] bottom-0 bg-[#F9FAFB] p-[20px] ">
              <button
                type="submit"
                className={`cursor-pointer bg-primary text-white h-[48px] w-[250px] text-lg font-semibold rounded-md text-center flex justify-center items-center`}
              >
                Đăng ký
              </button>
            </div>
          </form>
        </div>
      </Drawer>
    </div>
  );
}
