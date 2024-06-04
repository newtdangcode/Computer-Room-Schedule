import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import useDebounce from "../../hooks/useDebounce";
import { IconBin, IconAdd, IconDelete, IconBack, IconRestore } from "../../components/icon";
import { useSelector } from "react-redux";
import AddModalSubject from "../../components/subject/subjectAddModal";
import EditModalSubject from "../../components/subject/subjectEditModal";
import SubjectTable from "../../components/subject/subjectTable";
import SubjectDeletedTable from "../../components/subject/subjectDeletedTable";
import PageLayout from "../../components/layout/pageLayout";
import subjectAPI from "../../api/subjectAPI";
import StudentListModal from "../../components/student/studentListModal";

export default function Subject() {
  const [subject_id, setSubject_id] = useState();
  const [subject, setSubject] = useState();
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
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
  const [isShowStudentList, setIsShowStudentList] = useState(false);
  const [editSubject, setEditSubject] = useState();
  const [searchKeyWord, setSearchKeyWord] = useState("");
  const debounceValue = useDebounce(searchKeyWord, 500);
  useEffect(() => {
    getAllSubject();
  }, []);
  useEffect(() => {
    getAllSubject();
    //console.log('EMPLOYESS ',subjects);
  }, [debounceValue, isShowDeletedTable, currentPage, limitPerPage, sortValue, isShowAddModal, isShowEditModal]);
  useEffect(() => {
    if (isSelected.length === subjects.length && subjects.length > 0) {
      setIsSelectAll(true);
    }
    if (isSelected.length === 0) {
      setIsSelectAll(false);
    }
  }, [isSelected]);
  const handleSelectAll = () => {
    setIsSelectAll(!isSelectAll);
    if (!isSelectAll) {
      const allSubjectId = subjects.map((subject) => subject.id);
      setIsSelected(allSubjectId);
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
      setIsSelected(isSelected.filter((subject_id) => subject_id !== idInt));
    }
  };
  const getAllSubject = async () => {
    let params = { page: currentPage, limit: limitPerPage };
    params.filter = "";
    params.search = "";
    params.currentUser = currentUser;
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
      console.log(params);
      const response = await subjectAPI.getAll(params);
      if (response.data.length === 0 && response.currentPage !== 1 && response.currentPage > 1) {
        setCurrentPage(response.currentPage - 1);
      }
      setSubjects(response.data);
      setTotalPageCount(response.lastPage);
      setNextPage(response.nextPage);
      setPrevPage(response.prevPage);
      console.log(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSoftDelete = async (id) => {
    try {
      const idInt = parseInt(id, 10);
      await subjectAPI.update(idInt, { is_active: false });
      await getAllSubject();
    } catch (error) {
      console.log(error);
    }
  };
  const handleSoftDeleteMany = async () => {
    try {
      await subjectAPI.updateMany(isSelected.map((id) => ({ id: id, is_active: false })));
      await getAllSubject();
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
      await subjectAPI.update(idInt, { is_active: true });
      await getAllSubject();
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
      await subjectAPI.updateMany(data);
      await getAllSubject();
    } catch (err) {
      console.log(err);
    }
  };
  const handleShowAddModal = () => {
    setIsShowAddModal(!isShowAddModal);
  };
  const handleAddSubject = async (data) => {
    //console.log("fontend ",data);
    await subjectAPI.create(data);
  };
  const handleShowEditModal = async (id) => {
    const idInt = parseInt(id, 10);
    const editSubject = await subjects.find((subject) => subject.id === idInt);
    //console.log(subjects);
    setEditSubject(editSubject);
    setIsShowEditModal(!isShowEditModal);
  };
  const handleUpdateSubject = async (id, data) => {
    const idInt = parseInt(id, 10);
    await subjectAPI.update(idInt, data);
  };
  const handleCloseStudentList = () => {
    setIsShowStudentList(!isShowStudentList);
  };
  const handleShowStudentList = (id) => {
    setIsShowStudentList(!isShowStudentList);
    setSubject_id(id);
  };

  return (
    <PageLayout title="Môn học">
      {currentUser.account_id.role_id.id === 3 ? null : (
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
                        text: "Các Môn học sẽ được xoá và không thể khôi phục.",
                        icon: "question",
                        showCancelButton: true,
                        confirmButtonColor: "#0E9F6E",
                        cancelButtonColor: "#d33",
                        cancelButtonText: "Huỷ bỏ",
                        confirmButtonText: "Đồng ý!",
                      }).then((result) => {
                        if (result.isConfirmed) {
                          //handleDeleteMany();
                          Swal.fire({
                            title: "Đã xoá",
                            text: "Các Môn học đã được xoá.",
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
                        text: "Các Môn học sẽ được khôi phục.",
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
                            text: "Các Môn học đã được khôi phục.",
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
                        text: "Các Môn học sẽ được chuyển vào thùng rác.",
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
                            text: "Các Môn học đã được chuyển vào thùng rác.",
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
                Thêm Môn học
              </button>
            </div>
          </div>
        </div>
      )}

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
                <option value={JSON.stringify({ sort: "start_time:asc" })}>Ngày bắt đầu (Tăng dần)</option>
                <option value={JSON.stringify({ sort: "start_time:desc" })}>Ngày bắt đầu (Giảm dần)</option>
                <option value={JSON.stringify({ sort: "end_time:asc" })}>Ngày kết thúc (Tăng dần)</option>
                <option value={JSON.stringify({ sort: "end_time:desc" })}>Ngày kết thúc (Giảm dần)</option>
                <option value={JSON.stringify({ sort: "created_at:asc" })}>Ngày thêm (Tăng dần)</option>
                <option value={JSON.stringify({ sort: "created_at:desc" })}>Ngày thêm (Giảm dần)</option>
              </select>
            </div>
            {currentUser.account_id.role_id.id == 3 ? null : (
              <>
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
              </>
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-end mb-5 px-[20px]"></div>
      {isShowDeletedTable ? (
        <React.Fragment>
          <h1 className="text-black font-bold mb-5">Thùng rác</h1>
          <SubjectDeletedTable
            subjects={subjects}
            //handleDelete={handleDelete}
            handleRestore={handleRestore}
            handleShowStudentList={handleShowStudentList}
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
          <SubjectTable
            subjects={subjects}
            handleSoftDelete={handleSoftDelete}
            handleShowEditModal={handleShowEditModal}
            handleShowStudentList={handleShowStudentList}
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
        <AddModalSubject
          closeModal={handleShowAddModal}
          title={"THÊM Môn học"}
          titleBtnFooter={"THÊM"}
          handleAddSubject={handleAddSubject}
        />
      )}
      {isShowEditModal && (
        <EditModalSubject
          closeModal={handleShowEditModal}
          title={"CẬP NHẬT Môn học"}
          titleBtnFooter={"CẬP NHẬT"}
          handleUpdateSubject={handleUpdateSubject}
          editSubject={editSubject}
        />
      )}
      {isShowStudentList && <StudentListModal closeModal={handleCloseStudentList} subject_id={subject_id} />}
    </PageLayout>
  );
}
