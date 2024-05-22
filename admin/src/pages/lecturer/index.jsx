import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import useDebounce from "../../hooks/useDebounce";
import LecturerDeletedTable from "../../components/lecturer/lecturerDeletedTable";
import LecturerTable from "../../components/lecturer/lecturerTable";
import { IconBin, IconAdd, IconDelete, IconBack, IconRestore } from "../../components/icon";
import PageLayout from "../../components/layout/pageLayout";
import lecturerAPI from "../../api/lecturerAPI"
import { useSelector } from "react-redux";
import { date } from "yup";
import AddModalStaff from "../../components/lecturer/LecturerAddModal";
import studentAPI from "../../api/studentAPI";

export default function Lecturer() {
    const [lecturer, setLecturer] = useState([]);
    const [isSelectAll, setIsSelectAll] = useState(false);
  const [isSelected, setIsSelected] = useState([]);
  const [isShowLecturerDeletedTable, setIsShowLecturerDeletedTable] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPageCount, setTotalPageCount] = useState(0);
  const [limitPerPage, setLimitPerPage] = useState(10);
  const currentUser = useSelector((state) => state.auth.currentUser);
  const [sortValue, setSortValue] = useState("");
  const[isShowAddModal,setIsShowAddModal]=useState(false);
  const [searchKeyWord, setSearchKeyWord] = useState("");
  const debounceValue = useDebounce(searchKeyWord, 500);
  useEffect(()=>{
    getAllLecturer();
  },[])
  useEffect(()=>{
    getAllLecturer();
  },[
    debounceValue,
    isShowLecturerDeletedTable,
    currentPage,
    limitPerPage,
    sortValue,
  ]);
 
  const handleSelectAll = () => {
    // Toggle isSelectAll state
    setIsSelectAll(!isSelectAll);
    
    // If isSelectAll is true, select all lecturers; otherwise, clear selection
    if (!isSelectAll) {
      // Select all lecturers
      const allLecturerIds = lecturer.map((lecturer) => lecturer.id);
      setIsSelected(allLecturerIds);
    } else {
      
      setIsSelected([]);
    }
  
  };
  const handleSelected = (event) => {
    const { id, checked } = event.target;
    var idInt=parseInt(id,10);
    setIsSelected([...isSelected, idInt]);
    console.log(idInt,",",idInt);
    if (!checked) {
      setIsSelected(isSelected.filter((lecturer_id) => lecturer_id !== idInt));
    }
  };
  const getAllLecturer=async()=>{
    let params ={page:currentPage,limit:limitPerPage};
    if(debounceValue){
      params.search=debounceValue.trim();
    }
    if(sortValue){
      params={...params,...sortValue};
    }
    if(isShowLecturerDeletedTable){
      params.is_active=false
    }else{
      params.is_active=true;
    }
    try {
      const response = await lecturerAPI.getAllLecturer(params);
      if (response.data.length === 0 && response.currentPage !== 1) {
        setCurrentPage(response.currentPage - 1);
      }
      setLecturer(response.data);
     setTotalPageCount(response.totalPages);
    } catch (err) {
      console.log(err);
    }
    };
    const handleShowDeletedTable=()=>{
      setIsShowLecturerDeletedTable(!isShowLecturerDeletedTable);
    }
    const handleSoftDelete=async(id)=>{
      try {
        await lecturerAPI.updateLecturerStatus(id,{is_active:false})
        await getAllLecturer();
      } catch (error) {
        console.log(error)
      }
    }
    const handleDelete= async(id)=>{
      try{
        await lecturerAPI.deleteLecturer(id);
        await getAllLecturer();

      }catch(error){
        console.log(error)
      }
    }
    const handleRestore = async (id) => {
      try {
        await lecturerAPI.updateLecturerStatus(id, { is_active: true });
        await getAllLecturer();
      } catch (error) {
        console.log(error);
      }
    };
    const handleShowAddModal=()=>{
      setIsShowAddModal(!isShowAddModal)
    }
    const handleAddLecturer = async (data)=>{
      const {first_name,last_name,code,email,phone_number,username,password}=data;
      await lecturerAPI.addLecturer({
        first_name,
        last_name,code,
        email,
        phone_number,
        username,
        password,
      
      })
    setIsShowAddModal(!isShowAddModal);
    await getAllLecturer();
      
    }

  

  return (
    <PageLayout title="Giảng viên">
      <div className="bg-white rounded-lg ring-1 ring-gray-200 ring-opacity-4 overflow-hidden mb-5 shadow-xs">
        <div className="p-4">
          <div className="flex justify-end items-center py-3 gap-x-4">
            {isShowLecturerDeletedTable ? (
              <React.Fragment>
                <button
                  disabled={isSelected.length <= 0}
                  onClick={() => {
                    Swal.fire({
                      title: "Bạn chắc chắn muốn khôi phục?",
                      text: "Các giảng viên sẽ được khôi phục.",
                      icon: "question",
                      showCancelButton: true,
                      confirmButtonColor: "#0E9F6E",
                      cancelButtonColor: "#d33",
                      cancelButtonText: "Huỷ bỏ",
                      confirmButtonText: "Đồng ý!",
                    }).then((result) => {
                      if (result.isConfirmed) {
                        //handleRestoreManyStaff();
                        Swal.fire({
                          title: "Đã Khôi phục",
                          text: "Các giảng viên đã được khôi phục.",
                          confirmButtonColor: "#0E9F6E",
                        });
                      }
                    });
                  }}
                  className={`h-12 align-bottom inline-flex leading-5 items-center justify-center 
                        transition-colors duration-150 font-medium px-10 py-2 rounded-lg text-sm 
                        text-white border border-transparent ${
                          isSelected.length > 0 ? "bg-yellow-400 cursor-pointer" : "bg-yellow-200 cursor-not-allowed"
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
                      text: "Các giảng viên sẽ được xoá và không thể khôi phục.",
                      icon: "question",
                      showCancelButton: true,
                      confirmButtonColor: "#0E9F6E",
                      cancelButtonColor: "#d33",
                      cancelButtonText: "Huỷ bỏ",
                      confirmButtonText: "Đồng ý!",
                    }).then((result) => {
                      if (result.isConfirmed) {
                        //handleDeleteManyStaff();
                        Swal.fire({
                          title: "Đã xoá",
                          text: "Các giảng viên đã được xoá.",
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
                      text: "Các giảng viên sẽ được chuyển vào thùng rác.",
                      icon: "question",
                      showCancelButton: true,
                      confirmButtonColor: "#0E9F6E",
                      cancelButtonColor: "#d33",
                      cancelButtonText: "Huỷ bỏ",
                      confirmButtonText: "Đồng ý!",
                    }).then((result) => {
                      if (result.isConfirmed) {
                        //handleSoftDeleteManyStaff();
                        Swal.fire({
                          title: "Đã chuyển vào thùng rác",
                          text: "Các giảng viên đã được chuyển vào thùng rác.",
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
                        text-white bg-primary border border-transparent hover:bg-[#a41c15] "
              onClick={handleShowAddModal}
            >
              <span className="mr-3">
                <IconAdd />
              </span>
              Thêm giảng Viên
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
                <option value={JSON.stringify({ sort: "last_name" })}>Tên (Tăng dần)</option>
                <option value={JSON.stringify({ sort: "-last_name" })}>Tên (Giảm dần)</option>
                <option value={JSON.stringify({ sort: "createdAt" })}>Ngày thêm (Tăng dần)</option>
                <option value={JSON.stringify({ sort: "-createdAt" })}>Ngày thêm (Giảm dần)</option>
              
              </select>
              
            </div>
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
              </div>
              </div>
              </div>
      <div className="flex justify-end mb-5 px-[20px]"></div>
      {/* {isShowLecturerDeletedTable ? (
        <React.Fragment>
          <h1 className="text-black font-bold mb-5">Thùng rác</h1>
          <LecturerDeletedTable
            lecturer={lecturer}
            handleDelete={handleDelete}
          handleRestore={handleRestore}
            handleSelected={handleSelected}
            isSelected={isSelected}
            handleSelectAll={handleSelectAll}
            isSelectAll={isSelectAll}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}x
            totalPageCount={totalPageCount}
            limitPerPage={limitPerPage}
            setLimitPerPage={setLimitPerPage}
            currentUser={currentUser}
          />
        </React.Fragment>
      ) : (
        <React.Fragment>
          <h1 className="text-black font-bold mb-5">Danh sách</h1>
          <LecturerTable
            lecturer={lecturer}
            isSelectAll={isSelectAll}
            isSelected={isSelected}
            handleSoftDelete={handleSoftDelete}
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
      )}
      {isShowAddModal && (
        <AddModalStaff
          closeModal={handleShowAddModal}
          title="THÊM GIẢNG VIÊN"
          titleBtnFooter="THÊM"
        handleAddLecturer={handleAddLecturer}
        getAllLecturer={getAllLecturer}
        />
      )}
       */}
    </PageLayout>
  );
}
