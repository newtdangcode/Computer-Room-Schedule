import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import LecturerTable from "../../components/lecturer/lecturerTable";
import useDebounce from "../../hooks/useDebounce";
import LecturerDeletedTable from "../../components/lecturer/lecturerDeletedTable";
import { IconBin, IconAdd, IconDelete, IconBack, IconRestore } from "../../components/icon";
import PageLayout from "../../components/layout/pageLayout";
import lecturerAPI from "../../api/lecturerAPI";
import { useSelector } from "react-redux";
import AddModalLecturer from "../../components/lecturer/LecturerAddModal";
import EditModalLecturer from "../../components/lecturer/lecturerEditModal";

export default function Employee() {
  const [lecturers, setLecturers] = useState([]);
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
  const [sortValue, setSortValue] = useState("");
  const [isShowAddModal, setIsShowAddModal] = useState(false);
  const [isShowEditModal, setIsShowEditModal] = useState(false);
  const [editLecturer, setEditLecturer] = useState();
  const [searchKeyWord, setSearchKeyWord] = useState("");
  const debounceValue = useDebounce(searchKeyWord, 500);
  useEffect(() => {
    getAllLecturer();
    
  }, []);
  useEffect(() => {
    getAllLecturer();
    
    //console.log('EMPLOYESS ',lecturers);
  }, [debounceValue, isShowDeletedTable, currentPage, limitPerPage, sortValue, isShowAddModal, isShowEditModal]);
  useEffect(() => {
    if(isSelected.length === lecturers.length && lecturers.length > 0) {
      setIsSelectAll(true);
    }
  }, [ isSelected]);
  const handleSelectAll = () => {
    setIsSelectAll(!isSelectAll);
    if (!isSelectAll) {
      const allLecturerCodes = lecturers.map((lecturer) => lecturer.code);
      setIsSelected(allLecturerCodes);
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
      setIsSelected(isSelected.filter((lecturer_code) => lecturer_code !== code));
    }
  };
  const getAllLecturer = async () => {
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
      const response = await lecturerAPI.getAll(params);
      if (response.data.length === 0 && response.currentPage !== 1 && response.currentPage > 1) {
        setCurrentPage(response.currentPage - 1);
      }
      
      setLecturers(response.data);
      setTotalPageCount(response.lastPage);
      setNextPage(response.nextPage);
      setPrevPage(response.prevPage);
    } catch (err) {
      console.log(err);
    }
  };
  const handleSoftDelete = async (code) => {
    try {
      await lecturerAPI.update(code, { is_active: false });
      await getAllLecturer();
    } catch (error) {
      console.log(error);
    }
  };
  const handleSoftDeleteMany = async () => {
    try {
      await lecturerAPI.updateMany(isSelected.map((code) => ({ code: code, is_active: false })));
      await getAllLecturer();
    } catch (error) {
      console.log(error);
    }
  };
  const handleShowDeletedTable = () => {
    setIsShowDeletedTable(!isShowDeletedTable);
  };
  const handleRestore = async (code) => {
    try {
      await lecturerAPI.update(code, { is_active: true });
      await getAllLecturer();
    } catch (err) {
      console.log(err);
    }
  };
  const handleRestoreMany = async() => {
    const data = [];
    isSelected.map((code)=>{
      data.push({code:code,is_active:true});
    });
    try {
      await lecturerAPI.updateMany(data);
      await getAllLecturer();
    } catch (err) {
      console.log(err);
    }
  };
  const handleShowAddModal = () => {
    setIsShowAddModal(!isShowAddModal);
  };
  const handleAddLecturer = async (data) => {
    //console.log("fontend ",data);
    await lecturerAPI.create(data);
  };
  const handleShowEditModal = async(code) => {
    const editLecturer = await lecturers.find((lecturer) => lecturer.code === code);
    
    setEditLecturer(editLecturer);
    setIsShowEditModal(!isShowEditModal);
  };
  const handleUpdateLecturer = async (code, data) => {
    await lecturerAPI.update(code, data);
  }

  return (
    <PageLayout title="Giảng viên">
      <div className="bg-white rounded-lg ring-1 ring-gray-200 ring-opacity-4 overflow-hidden mb-5 shadow-xs">
        <div className="p-4">
          <div className="flex justify-end items-center py-3 gap-x-4">
            {isShowDeletedTable ? (
              <React.Fragment>
                <button

                  disabled={isSelected.length <= 0}
                  onClick={() => {
                    Swal.fire({
                      title: "Bạn chắc chắn muốn xoá?",
                      text: "Các Giảng viên sẽ được xoá và không thể khôi phục.",
                      icon: "question",
                      showCancelButton: true,
                      confirmButtonColor: "#0E9F6E",
                      cancelButtonColor: "#d33",
                      cancelButtonText: "Huỷ bỏ",
                      confirmButtonText: "Đồng ý!",
                    }).then((result) => {
                      if (result.isConfirmed) {
                        //handleDeleteManystudent();
                        Swal.fire({
                          title: "Đã xoá",
                          text: "Các Giảng viên đã được xoá.",
                          confirmButtonColor: "#0E9F6E",
                        });
                      }
                    });
                  }}
                  className={` h-12 align-bottom inline-flex leading-5 items-center justify-center 
                      transition-colors duration-150 font-medium px-10 py-2 rounded-lg text-sm 
                      text-white border border-transparent hidden ${
                        isSelected.length > 0
                          ? "bg-red-600 cursor-pointer hover:bg-red-800"
                          : "bg-red-300 cursor-not-allowed"
                      }`}
                >
                  <span className="mr-3">
                    <IconDelete />
                  </span>
                  Xoá
                </button>
                <button
                  disabled={isSelected.length <= 0}
                  onClick={() => {
                    Swal.fire({
                      title: "Bạn chắc chắn muốn khôi phục?",
                      text: "Các Giảng viên sẽ được khôi phục.",
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
                          text: "Các Giảng viên đã được khôi phục.",
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
              </React.Fragment>
            ) : (
              <React.Fragment>
                <button
                  disabled={isSelected.length <= 0}
                  onClick={() => {
                    Swal.fire({
                      title: "Bạn chắc chắn muốn xoá?",
                      text: "Các Giảng viên sẽ được chuyển vào thùng rác.",
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
                          text: "Các Giảng viên đã được chuyển vào thùng rác.",
                          confirmButtonColor: "#0E9F6E",
                        });
                      }
                    });
                  }}
                  className={`h-12 align-bottom inline-flex leading-5 items-center justify-center 
                        transition-colors duration-150 font-medium px-10 py-2 rounded-lg text-sm 
                        text-white border border-transparent ${
                          isSelected.length > 0
                            ? "bg-red-600 cursor-pointer hover:bg-red-800"
                            : "bg-red-300 cursor-not-allowed"
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
              onClick={handleShowAddModal}
            >
              <span className="mr-3">
                <IconAdd />
              </span>
              Thêm Giảng Viên
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
                <option value={JSON.stringify({ sort: "last_name:asc" })}>Tên (Tăng dần)</option>
                <option value={JSON.stringify({ sort: "last_name:desc" })}>Tên (Giảm dần)</option>
                <option value={JSON.stringify({ sort: "created_at:asc" })}>Ngày thêm (Tăng dần)</option>
                <option value={JSON.stringify({ sort: "created_at:desc" })}>Ngày thêm (Giảm dần)</option>
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
          <LecturerDeletedTable
            lecturers={lecturers}
            //handleDelete={handleDelete}
            handleRestore={handleRestore}
            handleSelected={handleSelected}
            isSelected={isSelected}
            handleSelectAll={handleSelectAll}
            isSelectAll={isSelectAll}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPageCount={totalPageCount}
            nextPage={nextPage}
            prevPage={prevPage}
            limitPerPage={limitPerPage}
            setLimitPerPage={setLimitPerPage}
            currentUser={currentUser}
          />
        </React.Fragment>
      ) : (
        <React.Fragment>
          <h1 className="text-black font-bold mb-5">Danh sách</h1>
          <LecturerTable
            lecturers={lecturers}
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
          />
        </React.Fragment>
      )}
      {isShowAddModal && (
        <AddModalLecturer
          closeModal={handleShowAddModal}
          title={"THÊM Giảng VIÊN"}
          titleBtnFooter={"THÊM"}
          handleAddLecturer={handleAddLecturer}
        />
      )}
      {isShowEditModal && (
        <EditModalLecturer
          closeModal={handleShowEditModal}
          title={"CẬP NHẬT Giảng VIÊN"}
          titleBtnFooter={"CẬP NHẬT"}
          handleUpdateLecturer={handleUpdateLecturer}
          lecturer={editLecturer}
        
        />
      )}
    </PageLayout>
  );
}
