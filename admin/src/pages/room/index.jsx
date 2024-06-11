import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import RoomDeletedTable from "../../components/room/roomDeletedTable";
import RoomTable from "../../components/room/roomTable";
import { IconBin, IconAdd, IconDelete, IconBack, IconRestore, IconUploadFile } from "../../components/icon";
import PageLayout from "../../components/layout/pageLayout";
import roomAPI from "../../api/roomAPI";
import { useSelector } from "react-redux";
import useDebounce from "../../hooks/useDebounce";
import AddModalRoom from "../../components/room/roomAddModal";
import EditModalRoom from "../../components/room/RoomEditModal";
import UploadFileModal from "../../components/uploadFileModal";

export default function Room() {
  const [rooms, setRooms] = useState([]);
  const [isSelectAll, setIsSelectAll] = useState(false);
  const [isSelected, setIsSelected] = useState([]);
  const [isShowDeletedTable, setIsShowDeletedTable] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPageCount, setTotalPageCount] = useState(0);
  const [nextPage, setNextPage] = useState();
  const [prevPage, setPrevPage] = useState();
  const [isShowAddModal, setIsShowAddModal] = useState(false);
  const [limitPerPage, setLimitPerPage] = useState(10);
  const currentUser = useSelector((state) => state.auth.currentUser);
  const [sortValue, setSortValue] = useState("");
  const [editRoom, setEditRoom] = useState();
  const [searchKeyWord, setSearchKeyWord] = useState("");
  const [isShowUploadFileModal, setIsShowUploadFileModal] = useState(false);
  const [isShowEditModal, setIsShowEditModal] = useState(false);
  const debounceValue = useDebounce(searchKeyWord, 500);
  useEffect(() => {
    getAllRoom();
  }, []);
  useEffect(() => {
    getAllRoom();
  }, [debounceValue, isShowDeletedTable, isShowAddModal, currentPage, limitPerPage, sortValue, isShowUploadFileModal]);
  useEffect(() => {
    if (isSelected.length === rooms.length && rooms.length > 0) {
      setIsSelectAll(true);
    }else{
      setIsSelectAll(false);
    }
    if (isSelected.length === 0) {
      setIsSelectAll(false);
    }

  }, [isSelected]);
  const handleSelectAll = () => {
    setIsSelectAll(!isSelectAll);
    if (!isSelectAll) {
      const allRoomIds = rooms.map((_room) => _room.code);
      setIsSelected(allRoomIds);
    } else {
      setIsSelected([]);
    }
  };
  const handleSelected = (event) => {
    const { id, checked } = event.target;
    const code = id;
    //const { code } = event.target.getAttribute("code");
    //var codeInt=parseInt(code,10);
    setIsSelected([...isSelected, code]);
    //console.log(checked, "-", code);
    if (!checked) {
      setIsSelected(isSelected.filter((room_code) => room_code !== code));
    }
    console.log(id);
  };
  const getAllRoom = async () => {
    let params = { page: currentPage, limit: limitPerPage };
    params.filter = "";
    params.search = "";
    if (debounceValue) {
      params.search = debounceValue.trim();
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
      const response = await roomAPI.getAll(params);
      if (response.data.length === 0 && response.currentPage !== 1 && response.currentPage > 1) {
        setCurrentPage(response.currentPage - 1);
      }
      setRooms(response.data);
      setTotalPageCount(response.lastPage);
      setNextPage(response.nextPage);
      setPrevPage(response.prevPage);
      console.log(response.data);
    } catch (err) {
      console.log("Error:", err.response ? err.response.data : err.message);
    }
  };

  const handleSoftDelete = async () => {
    try {
      await roomAPI.updateMany(isSelected.map((code) => ({ code: code, is_active: false, status_id: 3 })));
      await getAllRoom();
    } catch (error) {
      console.log(error);
    }
  };
  const handleSoftDeleteMany = async () => {
    try {
      await roomAPI.updateMany(isSelected.map((code) => ({ code: code, is_active: false, status_id: 3 })));
      await getAllRoom();
    } catch (err) {
      console.log(err);
    }
  };
  const handleShowDeletedTable = () => {
    setIsShowDeletedTable(!isShowDeletedTable);
  };
  const handleRestore = async () => {
    try {
      await roomAPI.updateMany(isSelected.map((code) => ({ code: code, is_active: true, status_id: 1 })));
      await getAllRoom();
    } catch (error) {
      console.log(error);
    }
  };
  const handleRestoreMany = async () => {
    const data = [];
    isSelected.map((code) => {
      data.push({ code: code, is_active: true, status_id: 1 });
    });
    try {
      await roomAPI.updateMany(data);
      await getAllRoom();
    } catch (err) {
      console.log(err);
    }
  };

  const handleShowAddModal = () => {
    setIsShowAddModal(!isShowAddModal);
  };
  const handleAddRoom = async (data) => {
    await roomAPI.create(data);
  };
  const handleShowEditModal = async (code) => {
    const editRoom = await rooms.find((_room) => _room.code === code);
    setEditRoom(editRoom);
    setIsShowEditModal(!isShowEditModal);
    getAllRoom();
  };
  const handleUpdateRoom = async (code, data) => {
    await roomAPI.update(code, data);
  };
  const handleShowUploadFileModal = () => {
    setIsShowUploadFileModal(!isShowUploadFileModal);
  };
  const handleUploadFile = async (data) => {
    const roomList = [];

    // Sử dụng for...of để chờ đợi các promise
    for (const item of data) {
      const room = {
        'name': item[1],
        'code': item[2],
        'machine_quantity': item[3],
        'employee_code': item[4],
        'status_id': 1,
      };
      roomList.push(room);
    }

    if (roomList.length > 0) {
      return await roomAPI.createMany(roomList);
    }
  };
  return (
    <PageLayout title="Phòng máy">
      <div className="bg-white rounded-lg ring-1 ring-gray-200 ring-opacity-4 overflow-hidden mb-5 shadow-xs">
        <div className="p-4">
          <div className="flex justify-end items-center py-3 gap-x-4">
            {isShowDeletedTable ? (
              <React.Fragment>
                <button
                  disabled={isSelected.length <= 0}
                  onClick={() => {
                    Swal.fire({
                      title: "Bạn chắc chắn muốn khôi phục?",
                      text: "Các phòng máy sẽ được khôi phục.",
                      icon: "question",
                      showCancelButton: true,
                      confirmButtonColor: "#0E9F6E",
                      cancelButtonColor: "#d33",
                      cancelButtonText: "Huỷ bỏ",
                      confirmButtonText: "Đồng ý!",
                    }).then((result) => {
                      if (result.isConfirmed) {
                        handleRestoreMany();
                        Swal.fire({
                          title: "Đã Khôi phục",
                          text: "Các phòng máy đã được khôi phục.",
                          confirmButtonColor: "#0E9F6E",
                        });
                      }
                    });
                  }}
                  className={`h-12 align-bottom inline-flex leading-5 items-center justify-center 
                      transition-colors duration-150 font-medium px-10 py-2 rounded-lg text-sm 
                       border  ${
                         isSelected.length > 0
                           ? "bg-white border-primaryRed text-primary cursor-pointer hover:bg-primary hover:text-white"
                           : "bg-white border-red-200 text-red-200 cursor-not-allowed"
                       }`}
                >
                  <span className="mr-3">
                    <IconRestore />
                  </span>
                  Khôi phục
                </button>

                <button
                  disabled={isSelected.length <= 0}
                  onClick={() => {
                    Swal.fire({
                      title: "Bạn chắc chắn muốn xoá?",
                      text: "Các phòng máy sẽ được xoá và không thể khôi phục.",
                      icon: "question",
                      showCancelButton: true,
                      confirmButtonColor: "#0E9F6E",
                      cancelButtonColor: "#d33",
                      cancelButtonText: "Huỷ bỏ",
                      confirmButtonText: "Đồng ý!",
                    }).then((result) => {
                      if (result.isConfirmed) {
                        handleSoftDelete();
                        Swal.fire({
                          title: "Đã xoá",
                          text: "Các phòng máy đã được xoá.",
                          confirmButtonColor: "#0E9F6E",
                        });
                      }
                    });
                  }}
                  className={`h-12 align-bottom inline-flex leading-5 items-center justify-center 
                        transition-colors duration-150 font-medium px-10 py-2 rounded-lg text-sm 
                        text-white border border-transparent ${
                          isSelected.length > 0 ? "bg-red-600 cursor-pointer" : "bg-red-300 cursor-not-allowed"
                        }`}
                >
                  <span className="mr-3">
                    <IconDelete />
                  </span>
                  Xoá
                </button>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <button
                  disabled={isSelected.length <= 0}
                  onClick={() => {
                    Swal.fire({
                      title: "Bạn chắc chắn muốn xoá?",
                      text: "Các phòng máy sẽ được chuyển vào thùng rác.",
                      icon: "question",
                      showCancelButton: true,
                      confirmButtonColor: "#0E9F6E",
                      cancelButtonColor: "#d33",
                      cancelButtonText: "Huỷ bỏ",
                      confirmButtonText: "Đồng ý!",
                    }).then((result) => {
                      if (result.isConfirmed) {
                        handleSoftDeleteMany();
                        Swal.fire({
                          title: "Đã chuyển vào thùng rác",
                          text: "Các phòng máy đã được chuyển vào thùng rác.",
                          confirmButtonColor: "#0E9F6E",
                        });
                      }
                    });
                  }}
                  className={`h-12 align-bottom inline-flex leading-5 items-center justify-center 
                        transition-colors duration-150 font-medium px-10 py-2 rounded-lg text-sm 
                        text-white border border-transparent ${
                          isSelected.length > 0 ? "bg-red-600 cursor-pointer" : "bg-red-300 cursor-not-allowed"
                        }`}
                >
                  <span className="mr-3">
                    <IconDelete />
                  </span>
                  Xoá
                </button>
              </React.Fragment>
            )}
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
            <button
              className="h-12 align-bottom inline-flex leading-5 items-center justify-center 
              cursor-pointer transition-colors duration-150 font-medium px-4 py-2 rounded-lg text-sm 
              text-primary bg-white border border-primaryRed  hover:bg-primary hover:text-white "
              onClick={handleShowAddModal}
            >
              <span className="mr-3">
                <IconAdd />
              </span>
              Thêm phòng máy
            </button>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg ring-1 ring-gray-200 ring-opacity-4 overflow-huser_idden mb-5 shadow-xs">
        <div className="p-4">
          <div className="py-3 flex gap-4 lg:gap-6 xl:gap-6 md:flex xl:flex">
            <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
              <input
                value={searchKeyWord}
                className="block w-full h-12 px-3 py-1 text-sm focus:outline-none leading-5 
                        rounded-md focus:border-gray-200 border-gray-200 bg-gray-100 ring-1 ring-gray-200
                        focus:bg-white border-transparent"
                type="text"
                name="searchKeyWord"
                placeholder="Tìm theo tên"
                onChange={(e) => setSearchKeyWord(e.target.value)}
              />
            </div>

            <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow ">
              <select
                defaultValue={sortValue.value}
                onChange={(e) => {
                  if (e.target.value) {
                    setSortValue(JSON.parse(e.target.value));
                  } else {
                    setSortValue("");
                  }
                }}
                className="block w-full h-12 px-2 py-1 text-sm focus:outline-none leading-5 
                        rounded-md focus:border-gray-200 border-gray-200 bg-gray-100 ring-1 ring-gray-200
                        focus:bg-white border-transparent form-select "
              >
                <option value="" huser_idden="">
                  Sắp xếp
                </option>
                <option value={JSON.stringify({ sort: "name:asc" })}>Tên (Tăng dần)</option>
                <option value={JSON.stringify({ sort: "name:desc" })}>Tên (Giảm dần)</option>
                <option value={JSON.stringify({ sort: "machine_quantity:asc" })}>Số máy(Tăng dần)</option>
                <option value={JSON.stringify({ sort: "machine_quantity:desc" })}>Số máy (giảm dần)</option>
              </select>
            </div>

            {isShowDeletedTable ? (
              <button
                className="h-12 align-bottom inline-flex leading-5 items-center justify-center 
              transition-colors duration-150 font-medium px-10 py-2 rounded-lg text-sm 
              text-white bg-red-500 hover:bg-red-700 border border-transparent"
                onClick={() => {
                  handleShowDeletedTable();
                  setIsSelected([]);
                  setIsSelectAll(false);
                }}
              >
                <span className="mr-3">
                  <IconBack />
                </span>
                Quay lại
              </button>
            ) : (
              <button
                className="h-12 align-bottom inline-flex leading-5 items-center justify-center 
                        transition-colors duration-150 font-medium px-10 py-2 rounded-lg text-sm 
                        text-white bg-red-500 hover:bg-red-700 border border-transparent"
                onClick={() => {
                  handleShowDeletedTable();
                  setIsSelected([]);
                  setIsSelectAll(false);
                }}
              >
                <span className="mr-3">
                  <IconBin />
                </span>
                Thùng rác
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-end mb-5 px-[20px]"></div>
      {isShowDeletedTable ? (
        <React.Fragment>
          <h1 className="text-black font-bold mb-5">Thùng rác</h1>
          <RoomDeletedTable
            rooms={rooms}
            //handleDelete={handleDeleteStaff}
            handleRestore={handleRestore}
            handleSelected={handleSelected}
            isSelected={isSelected}
            handleSelectAll={handleSelectAll}
            isSelectAll={isSelectAll}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            nextPage={nextPage}
            prevPage={prevPage}
            totalPageCount={totalPageCount}
            limitPerPage={limitPerPage}
            setLimitPerPage={setLimitPerPage}
            currentUser={currentUser}
          />
        </React.Fragment>
      ) : (
        <React.Fragment>
          <h1 className="text-black font-bold mb-5">Danh sách</h1>
          <RoomTable
            rooms={rooms}
            handleSoftDelete={handleSoftDelete}
            handleShowEditModal={handleShowEditModal}
            isSelectAll={isSelectAll}
            isSelected={isSelected}
            handleSelectAll={handleSelectAll}
            handleSelected={handleSelected}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPageCount={totalPageCount}
            limitPerPage={limitPerPage}
            setLimitPerPage={setLimitPerPage}
            currentUser={currentUser}
          />
        </React.Fragment>
      )}{" "}
      {isShowAddModal && (
        <AddModalRoom
          closeModal={handleShowAddModal}
          title={"Thêm phòng"}
          titleBtnFooter={"Thêm"}
          handleAddRoom={handleAddRoom}
        />
      )}
      {isShowEditModal && (
        <EditModalRoom
          closeModal={handleShowEditModal}
          title={"CẬP NHẬT PHÒNG"}
          titleBtnFooter={"CẬP NHẬT"}
          handleUpdateRoom={handleUpdateRoom}
          editRoom={editRoom}
        />
      )}
      {isShowUploadFileModal && (
        <UploadFileModal closeModal={handleShowUploadFileModal} handleUploadFile={handleUploadFile} />
      )}
    </PageLayout>
  );
}
