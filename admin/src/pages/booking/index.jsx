import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import useDebounce from "../../hooks/useDebounce";
import {
  IconBin,
  IconAdd,
  IconDelete,
  IconBack,
  IconRestore,
  IconReject,
  IconAccept,
  IconUploadFile,
} from "../../components/icon";
import { useSelector } from "react-redux";
import PageLayout from "../../components/layout/pageLayout";
import bookingAPI from "../../api/bookingAPI";
import AddModalBooking from "../../components/booking/bookingAddModal";
import BookingTable from "../../components/booking/bookingTable";
import UploadFileModal from "../../components/uploadFileModal";
import { io } from "socket.io-client";
import RoomAPI from "../../api/roomAPI";
import semesterAPI from "../../api/semesterAPI";
import lecturerAPI from "../../api/lecturerAPI";
import subjectAPI from "../../api/subjectAPI";
const socket = io("http://localhost:8080");

export default function Booking() {
  const [lecturers, setLecturers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [isSelectAll, setIsSelectAll] = useState(false);
  const [isSelected, setIsSelected] = useState([]);
  const [isShowDeletedTable, setIsShowDeletedTable] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPageCount, setTotalPageCount] = useState(0);
  const [limitPerPage, setLimitPerPage] = useState(5);
  const [nextPage, setNextPage] = useState();
  const [prevPage, setPrevPage] = useState();
  const [lastPage, setLastPage] = useState();
  const currentUser = useSelector((state) => state.auth.currentUser);
  const [sortValue, setSortValue] = useState({ sort: "created_at:desc" });
  const [filterByRoom, setFilterByRoom] = useState("");
  const [filterByShift, setFilterByShift] = useState("");
  const [filterByLecturer, setFilterByLecturer] = useState("");
  const [filterBySubject, setFilterBySubject] = useState("");
  const [filterBySemester, setFilterBySemester] = useState("");
  const [isShowAddModal, setIsShowAddModal] = useState(false);
  const [isShowEditModal, setIsShowEditModal] = useState(false);
  const [isShowUploadFileModal, setIsShowUploadFileModal] = useState(false);
  const [editBooking, setEditBooking] = useState();
  const [searchKeyWord, setSearchKeyWord] = useState("");
  const debounceValue = useDebounce(searchKeyWord, 500);
  useEffect(() => {
    getAllSubject();
    getAllLecturer();
    getAllSemester();
    getAllRoom();
    getAllBooking();
  }, []);
  useEffect(() => {
    getAllBooking();
    //console.log('EMPLOYESS ',bookings);
  }, [
    debounceValue,
    isShowDeletedTable,
    currentPage,
    limitPerPage,
    sortValue,
    isShowAddModal,
    isShowEditModal,
    isShowUploadFileModal,
    filterByRoom,
    filterBySemester,
    filterByShift,
    filterByLecturer,
    filterBySubject,
  ]);
  useEffect(() => {
    if (isSelected.length === bookings.length && bookings.length > 0) {
      setIsSelectAll(true);
    } else {
      setIsSelectAll(false);
    }
    if (isSelected.length === 0) {
      setIsSelectAll(false);
    }
  }, [isSelected]);
  const handleSelectAll = () => {
    setIsSelectAll(!isSelectAll);
    if (!isSelectAll) {
      const allBookingsId = bookings.map((booking) => booking.id);
      setIsSelected(allBookingsId);
    } else {
      setIsSelected([]);
    }
  };
  const handleSelected = (event) => {
    const { id, checked } = event.target;

    //const { code } = event.target.getAttribute("code");
    const idInt = parseInt(id, 10);
    setIsSelected([...isSelected, idInt]);
    //console.log(checked, "-", code);
    if (!checked) {
      setIsSelected(isSelected.filter((booking_id) => booking_id !== idInt));
    }
  };
  const getAllSubject = async () => {
    try {
      const response = await subjectAPI.getAllWithoutParams();
      setSubjects(response.data);
    } catch (err) {
      console.log(err);
    }
  };
  const getAllLecturer = async () => {
    try {
      const response = await lecturerAPI.getAllWithoutParams();
      setLecturers(response.data);
    } catch (err) {
      console.log(err);
    }
  };
  const getAllSemester = async () => {
    try {
      const response = await semesterAPI.getAllWithoutParams();
      setSemesters(response.data);
    } catch (err) {
      console.log(err);
    }
  };
  const getAllRoom = async () => {
    try {
      const response = await RoomAPI.getAllWithoutParams();
      setRooms(response.data);
    } catch (err) {
      console.log(err);
    }
  };
  const getAllBooking = async () => {
    let params = { page: currentPage, limit: limitPerPage };
    params.filter = "";
    params.search = "";
    params.currentUser = currentUser;
    if (debounceValue) {
      params.search = debounceValue.trim();
    }
    if (filterByRoom) {
      params.room_code = filterByRoom;
    }
    if (filterBySemester) {
      params.semester_id = filterBySemester;
    }
    if (filterByShift) {
      params.shift_id = filterByShift;
    }
    if (sortValue) {
      params = { ...params, ...sortValue };
    }
    if (isShowDeletedTable) {
      params.is_active = false;
    } else {
      params.is_active = true;
    }
    try {
      const response = await bookingAPI.getAll(params);
      if (response.data.length === 0 && response.currentPage !== 1 && response.currentPage > 1) {
        setCurrentPage(response.currentPage - 1);
      }
      setBookings(response.data);
      setTotalPageCount(response.lastPage);
      setNextPage(response.nextPage);
      setPrevPage(response.prevPage);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSoftDelete = async (id) => {
    try {
      const idInt = parseInt(id, 10);
      await bookingAPI.update(idInt, { is_active: false });
      await getAllBooking();
    } catch (error) {
      console.log(error);
    }
  };
  const handleSoftDeleteMany = async () => {
    try {
      await bookingAPI.updateMany(isSelected.map((id) => ({ id: id, is_active: false })));
      await getAllBooking();
    } catch (error) {
      console.log(error);
    }
  };
  const handleShowDeletedTable = () => {
    setIsShowDeletedTable(!isShowDeletedTable);
  };
  const handleRestore = async (id) => {
    try {
      const idInt = parseInt(id, 10);
      await bookingAPI.update(idInt, { is_active: true });
      await getAllBooking();
    } catch (err) {
      console.log(err);
    }
  };
  const handleRestoreMany = async () => {
    const data = [];
    isSelected.map((id) => {
      data.push({ id: id, is_active: true });
    });
    try {
      await bookingAPI.updateMany(data);
      await getAllBooking();
    } catch (err) {
      console.log(err);
    }
  };
  const handleShowAddModal = () => {
    setIsShowAddModal(!isShowAddModal);
  };
  const handleAddBooking = async (data) => {
    //console.log("fontend ",data);

    data.status_id = 1;
    await bookingAPI.create(data);
  };
  const handleShowEditModal = async (id) => {
    const idInt = parseInt(id, 10);
    const editBooking = await bookings.find((booking) => booking.id === idInt);
    //console.log(bookings);
    setEditBooking(editBooking);
    setIsShowEditModal(!isShowEditModal);
  };
  const handleUpdateBooking = async (id, data) => {
    const idInt = parseInt(id, 10);
    await bookingAPI.update(idInt, data);
  };

  const handleUpdateStatus = async (id, status_id) => {
    const idInt = parseInt(id, 10);
    await bookingAPI.update(idInt, {
      status_id: status_id,
      employee_code: currentUser.account_id.role_id.id === 3 ? null : currentUser.code,
    });
    if (currentUser.account_id.role_id.id === 3 && status_id === 3) {
      socket.emit("lecturerBooking", {
        account_id: currentUser.account_id.id,
        content: `${currentUser.first_name} ${currentUser.last_name} đã huỷ 1 đăng ký phòng.`,
      });
    }
    getAllBooking();
  };

  const handleUpdateManyStatus = async (status_id) => {
    const data = [];
    isSelected.map((id) => {
      data.push({ id: id, status_id: status_id, employee_code: currentUser.code });
    });
    try {
      await bookingAPI.updateMany(data);
      await getAllBooking();
    } catch (error) {
      console.log(error);
    }
  };
  const handleShowUploadFileModal = () => {
    setIsShowUploadFileModal(!isShowUploadFileModal);
  };
  const handleUploadFile = async (data) => {
    const bookingList = [];

    // Sử dụng for...of để chờ đợi các promise
    for (const item of data) {
      const booking = {
        subject_code: item[1],
        room_code: item[2],
        shift_name: item[3],
        day_of_week: item[4],
        week_start: item[5],
        week_quantity: item[6],
        semester_name: item[7],
      };
      bookingList.push(booking);
    }

    if (bookingList.length > 0) {
      return await bookingAPI.createMany(bookingList);
    }
  };
  return (
    <PageLayout title="Đăng ký phòng máy">
      <div className="bg-white rounded-lg ring-1 ring-gray-200 ring-opacity-4 overflow-hidden mb-5 shadow-xs">
        <div className="p-4">
          <div className="flex justify-end items-center py-3 gap-x-4">
            {currentUser.account_id.role_id.id !== 3 ? (
              <React.Fragment>
                <button
                  disabled={isSelected.length <= 0}
                  onClick={() => {
                    Swal.fire({
                      title: "Bạn chắc chắn muốn xác nhận?",
                      text: "Các đăng ký phòng máy sẽ được xác nhận.",
                      icon: "question",
                      showCancelButton: true,
                      confirmButtonColor: "#0E9F6E",
                      cancelButtonColor: "#d33",
                      cancelButtonText: "Huỷ bỏ",
                      confirmButtonText: "Đồng ý!",
                    }).then((result) => {
                      if (result.isConfirmed) {
                        handleUpdateManyStatus(2);
                        Swal.fire({
                          title: "Xác nhận",
                          text: "Các Đăng ký phòng máy đã được xác nhận.",
                          confirmButtonColor: "#0E9F6E",
                        });
                      }
                    });
                  }}
                  className={`h-12 align-bottom inline-flex leading-5 items-center justify-center 
                        transition-colors duration-150 font-medium px-10 py-2 rounded-lg text-sm 
                        border ${
                          isSelected.length > 0
                            ? "border-primary bg-white text-primary cursor-pointer hover:text-white hover:bg-primary"
                            : "border-red-300 bg-white text-red-300 cursor-not-allowed"
                        }`}
                >
                  <span className="mr-3">
                    <IconAccept />
                  </span>
                  Xác nhận
                </button>
                <button
                  disabled={isSelected.length <= 0}
                  onClick={() => {
                    Swal.fire({
                      title: "Bạn chắc chắn muốn từ chối?",
                      text: "Các đăng ký phòng máy sẽ bị từ chối.",
                      icon: "question",
                      showCancelButton: true,
                      confirmButtonColor: "#0E9F6E",
                      cancelButtonColor: "#d33",
                      cancelButtonText: "Huỷ bỏ",
                      confirmButtonText: "Đồng ý!",
                    }).then((result) => {
                      if (result.isConfirmed) {
                        handleUpdateManyStatus(4);
                        Swal.fire({
                          title: "Từ chối",
                          text: "Các Đăng ký phòng máy đã bị từ chối.",
                          confirmButtonColor: "#0E9F6E",
                        });
                      }
                    });
                  }}
                  className={`h-12 align-bottom inline-flex leading-5 items-center justify-center 
                        transition-colors duration-150 font-medium px-10 py-2 rounded-lg text-sm 
                        text-white border border-transparent ${
                          isSelected.length > 0
                            ? "bg-primary cursor-pointer hover:bg-red-800"
                            : "bg-red-300 cursor-not-allowed"
                        }`}
                >
                  <span className="mr-3">
                    <IconReject />
                  </span>
                  Từ chối
                </button>
              </React.Fragment>
            ) : null}
            {currentUser.account_id.role_id.id !== 3 && (
              <button
                className="h-12 align-bottom inline-flex leading-5 items-center justify-center 
                cursor-pointer transition-colors duration-150 font-medium px-4 py-2 rounded-lg text-sm 
                text-primary bg-white border border-primaryRed  hover:bg-primary hover:text-white "
                onClick={handleShowUploadFileModal}
              >
                <span className="mr-3">
                  <IconUploadFile />
                </span>
                Nhập danh sách từ file
              </button>
            )}

            <button
              className="h-12 align-bottom inline-flex leading-5 items-center justify-center 
              cursor-pointer transition-colors duration-150 font-medium px-4 py-2 rounded-lg text-sm 
              text-primary bg-white border border-primaryRed  hover:bg-primary hover:text-white "
              onClick={handleShowAddModal}
            >
              <span className="mr-3">
                <IconAdd />
              </span>
              Tạo Đăng ký phòng
            </button>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg ring-1 ring-gray-200 ring-opacity-4 overflow-huser_idden mb-5 shadow-xs">
        <div className="p-4 flex-non">
          <div className="py-3 flex gap-4 lg:gap-6 xl:gap-6 md:flex xl:flex">
            {/* <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
              <input
                value={searchKeyWord}
                className="block w-full h-12 px-3 py-1 text-sm focus:outline-none leading-5 
                        rounded-md focus:border-gray-200 border-gray-200 bg-gray-100 ring-1 ring-gray-200
                        focus:bg-white border-transparent"
                type="text"
                name="searchKeyWord"
                placeholder="Tìm theo tên giảng  viên"
                onChange={(e) => setSearchKeyWord(e.target.value)}
              />
            </div> */}
            <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow ">
              <select
                defaultValue={filterByRoom}
                onChange={(e) => setFilterByRoom(e.target.value)}
                className="block w-full h-12 px-2 py-1 text-sm focus:outline-none leading-5 
                        rounded-md focus:border-gray-200 border-gray-200 bg-gray-100 ring-1 ring-gray-200
                        focus:bg-white border-transparent form-select "
              >
                <option value="">Chọn phòng</option>
                {rooms?.map((item) => (
                  <option value={item.code} key={item.code}>
                    {item.code}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow ">
              <select
                defaultValue={filterByLecturer}
                onChange={(e) => setFilterByLecturer(e.target.value)}
                className="block w-full h-12 px-2 py-1 text-sm focus:outline-none leading-5 
                        rounded-md focus:border-gray-200 border-gray-200 bg-gray-100 ring-1 ring-gray-200
                        focus:bg-white border-transparent form-select "
              >
                <option value="">Chọn giảng viên</option>
                {lecturers?.map((item) => (
                  <option value={item.code} key={item.code}>
                    {item.code} - {item.first_name} {item.last_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow ">
              <select
                defaultValue={filterBySubject}
                onChange={(e) => setFilterBySubject(e.target.value)}
                className="block w-full h-12 px-2 py-1 text-sm focus:outline-none leading-5 
                        rounded-md focus:border-gray-200 border-gray-200 bg-gray-100 ring-1 ring-gray-200
                        focus:bg-white border-transparent form-select "
              >
                <option value="">Chọn môn học</option>
                {subjects?.map((item) => (
                  <option value={item.id} key={item.id}>
                    {item.code} - {item.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="py-3 flex gap-4 lg:gap-6 xl:gap-6 md:flex xl:flex">
            <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow ">
              <select
                defaultValue={filterByShift}
                onChange={(e) => setFilterByShift(e.target.value)}
                className="block w-full h-12 px-2 py-1 text-sm focus:outline-none leading-5 
                        rounded-md focus:border-gray-200 border-gray-200 bg-gray-100 ring-1 ring-gray-200
                        focus:bg-white border-transparent form-select "
              >
                <option value="">Chọn ca</option>
                <option value="1">Ca sáng</option>
                <option value="2">Ca chiều</option>
              </select>
            </div>
            <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow ">
              <select
                defaultValue={filterBySemester}
                onChange={(e) => setFilterBySemester(e.target.value)}
                className="block w-full h-12 px-2 py-1 text-sm focus:outline-none leading-5 
                        rounded-md focus:border-gray-200 border-gray-200 bg-gray-100 ring-1 ring-gray-200
                        focus:bg-white border-transparent form-select "
              >
                <option value="">Chọn học kỳ</option>
                {semesters?.map((item) => (
                  <option value={item.id} key={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow ">
              <select
                defaultValue={{ sort: "created_at:asc" }}
                onChange={(e) => {
                  if (e.target.value) {
                    setSortValue(JSON.parse(e.target.value));
                  }
                }}
                className="block w-full h-12 px-2 py-1 text-sm focus:outline-none leading-5 
                        rounded-md focus:border-gray-200 border-gray-200 bg-gray-100 ring-1 ring-gray-200
                        focus:bg-white border-transparent form-select "
              >
                <option value={JSON.stringify({ sort: "created_at:desc" })}>Ngày thêm (Mới nhất)</option>
                <option value={JSON.stringify({ sort: "created_at:asc" })}>Ngày thêm (Cũ nhất)</option>
                <option value={JSON.stringify({ sort: "room_code.code:asc" })}>Phòng máy (Tăng dần)</option>
                <option value={JSON.stringify({ sort: "room_code.code:desc" })}>Phòng máy (Giảm dần)</option>
                <option value={JSON.stringify({ sort: "semester_id.start_time:asc" })}>Học kỳ (Tăng dần)</option>
                <option value={JSON.stringify({ sort: "semester_id.start_time:desc" })}>Học kỳ (Giảm dần)</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end mb-5 px-[20px]"></div>

      <React.Fragment>
        <h1 className="text-black font-bold mb-5">Danh sách</h1>
        <BookingTable
          bookings={bookings}
          handleSoftDelete={handleSoftDelete}
          handleShowEditModal={handleShowEditModal}
          isSelectAll={isSelectAll}
          isSelected={isSelected}
          handleSelectAll={handleSelectAll}
          handleSelected={handleSelected}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPageCount={totalPageCount}
          nextPage={nextPage}
          prevPage={prevPage}
          limitPerPage={limitPerPage}
          setLimitPerPage={setLimitPerPage}
          currentUser={currentUser}
          handleUpdateStatus={handleUpdateStatus}
        />
      </React.Fragment>

      {isShowAddModal && (
        <AddModalBooking
          closeModal={handleShowAddModal}
          title={"THÊM ĐĂNG KÝ PHÒNG"}
          titleBtnFooter={"THÊM"}
          handleAddBooking={handleAddBooking}
        />
      )}
      {isShowUploadFileModal && (
        <UploadFileModal closeModal={handleShowUploadFileModal} handleUploadFile={handleUploadFile} />
      )}
    </PageLayout>
  );
}
