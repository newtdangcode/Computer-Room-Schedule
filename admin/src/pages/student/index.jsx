import React, { useEffect, useState } from "react";
import useDebounce from "../../hooks/useDebounce";
import Swal from "sweetalert2";
import StudentTable from "../../components/student/StudentTable";
import StudentDeletedTable from "../../components/student/StudentDeletedTable";
import AddModalStaff from "../../components/student/StudentAddModal";
import { IconImport, IconBin, IconAdd, IconDelete, IconBack, IconRestore } from "../../components/icon";
import PageLayout from "../../components/layout/pageLayout";
import studentAPI from "../../api/studentAPI";
import classAPI from "../../api/classAPI";
import { useSelector } from "react-redux";

export default function Student() {
  const [students, setStudents] = useState([]);
  const [classs, setClasss] = useState([]);
  const [isSelectAll, setIsSelectAll] = useState(false);
  const [isSelected, setIsSelected] = useState([]);
  const [isShowDeletedTable, setIsShowDeletedTable] = useState(false);
  const [isShowAddModal, setIsShowAddModal] = useState(false);
  const [isShowEditModal, setIsShowEditModal] = useState(false);
  const [editData, setEditData] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPageCount, setTotalPageCount] = useState(0);
  const [limitPerPage, setLimitPerPage] = useState(10);
  const [filterByClasss, setFilterByClasss] = useState("");
  const [sortValue, setSortValue] = useState("");
  const [searchKeyWord, setSearchKeyWord] = useState("");
  const debounceValue = useDebounce(searchKeyWord, 500);

  const currentUser = useSelector((state) => state.auth.currentUser);

  useEffect(() => {
    getAllClass();
  }, []);

  useEffect(() => {
    getAllStudent();
  }, [
    debounceValue,
    isShowDeletedTable,
    currentPage,
    limitPerPage,
    filterByClasss,
    sortValue,

    // showAddStaffModal,
    // showEditStaffModal,
  ]);

  const handleSelectAll = () => {
    setIsSelectAll(!isSelectAll);
    setIsSelected(students.map((student) => student.id));
    console.log(
      !isSelectAll,
      "-",
      students.map((student) => student.id),
      ",",
      isSelected,
    );
    if (isSelectAll) {
      setIsSelected([]);
    }
  };
  const handleSelected = (event) => {
    const { id, checked } = event.target;
    var idInt = parseInt(id, 10);
    setIsSelected([...isSelected, idInt]);
    console.log(idInt, ",", isSelected);
    if (!checked) {
      setIsSelected(isSelected.filter((student_id) => student_id !== idInt));
    }
  };
  const getAllClass = async () => {
    try {
      const response = await classAPI.getAllClass();
      setClasss(response.data);
    } catch (err) {
      console.log(err);
    }
  };
  const getAllStudent = async () => {
    let params = { page: currentPage, limit: limitPerPage };
    if (debounceValue) {
      params.search = debounceValue.trim();
    }
    if (filterByClasss) {
      params.class_id = filterByClasss;
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
      const response = await studentAPI.getAllStudent(params);
      if (response.data.length === 0 && response.currentPage !== 1) {
        setCurrentPage(response.currentPage - 1);
      }
      setStudents(response.data);

      setTotalPageCount(response.totalPages);
    } catch (err) {
      console.log(err);
    }
  };
  const handleShowDeletedTable = () => {
    setIsShowDeletedTable(!isShowDeletedTable);
  };
  const handleShowAddModal = () => {
    setIsShowAddModal(!isShowAddModal);
  };
  const handleAddStudent = async (data) => {
    const { first_name, last_name, code, class_id, email, phone_number, username, password, role_id } = data;
    await studentAPI.addStudent({
      first_name,
      last_name,
      code,
      class_id,
      email,
      phone_number,
      username,
      password,
      role_id,
    });
    setIsShowAddModal(!isShowAddModal);
    await getAllStudent();
  };

  const handleShowEditModal = (data) => {
    setIsShowEditModal(!isShowEditModal);
    setEditData(data);
  };
  const handleUpdateStudent = async (id, data) => {
    try {
      await studentAPI.updateStudent(id, { ...data });
      setIsShowEditModal(!isShowEditModal);
      await getAllStudent();
    } catch (error) {
      console.log(error);
    }
  };

  const handleSoftDelete = async (id) => {
    try {
      await studentAPI.updateStudentStatus(id, { is_active: false });
      await getAllStudent();
    } catch (error) {
      console.log(error);
    }
  };
  const handleRestore = async (id) => {
    try {
      await studentAPI.updateStudentStatus(id, { is_active: true });
      await getAllStudent();
    } catch (error) {
      console.log(error);
    }
  };
  const handleDelete = async (id) => {
    try {
      await studentAPI.deleteStudent(id);
      await getAllStudent();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <PageLayout title="Sinh viên">
      <div className="bg-white rounded-lg ring-1 ring-gray-200 ring-opacity-4 overflow-huser_idden mb-5 shadow-xs">
        <div className="p-4">
          <div className="flex justify-end items-center py-3 gap-x-4">
            {isShowDeletedTable ? (
              <React.Fragment>
                <button
                  disabled={isSelected.length <= 0}
                  onClick={() => {
                    Swal.fire({
                      title: "Bạn chắc chắn muốn xoá?",
                      text: "Các sinh viên sẽ được xoá và không thể khôi phục.",
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
                          text: "Các sinh viên đã được xoá.",
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
                <button
                  disabled={isSelected.length <= 0}
                  onClick={() => {
                    Swal.fire({
                      title: "Bạn chắc chắn muốn khôi phục?",
                      text: "Các sinh viên sẽ được khôi phục.",
                      icon: "question",
                      showCancelButton: true,
                      confirmButtonColor: "#0E9F6E",
                      cancelButtonColor: "#d33",
                      cancelButtonText: "Huỷ bỏ",
                      confirmButtonText: "Đồng ý!",
                    }).then((result) => {
                      if (result.isConfirmed) {
                        //handleRestoreManystudent();
                        Swal.fire({
                          title: "Đã Khôi phục",
                          text: "Các sinh viên đã được khôi phục.",
                          confirmButtonColor: "#0E9F6E",
                        });
                      }
                    });
                  }}
                  className={`h-12 align-bottom inline-flex leading-5 items-center justify-center 
                        transition-colors duration-150 font-medium px-10 py-2 rounded-lg text-sm 
                         border border-transparent ${
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
                      text: "Các sinh viên sẽ được chuyển vào thùng rác.",
                      icon: "question",
                      showCancelButton: true,
                      confirmButtonColor: "#0E9F6E",
                      cancelButtonColor: "#d33",
                      cancelButtonText: "Huỷ bỏ",
                      confirmButtonText: "Đồng ý!",
                    }).then((result) => {
                      if (result.isConfirmed) {
                        //handleSoftDeleteManystudent();
                        Swal.fire({
                          title: "Đã chuyển vào thùng rác",
                          text: "Các sinh viên đã được chuyển vào thùng rác.",
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
                <button
                  disabled={isSelected.length <= 0}
                  className={`h-12 align-bottom inline-flex leading-5 items-center justify-center 
               transition-colors duration-150 font-medium px-4 py-2 rounded-lg text-sm 
               border border-transparent  ${
                 isSelected.length > 0
                   ? "bg-white border-primaryRed text-primary cursor-pointer hover:bg-primary hover:text-white"
                   : "bg-white border-red-200 text-red-200 cursor-not-allowed"
               }`}
                  // onClick={handleShowAddModal}
                >
                  <span className="mr-3">
                    <IconImport />
                  </span>
                  Thêm vào lớp
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
              Thêm Sinh Viên
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
                defaultValue={filterByClasss}
                onChange={(e) => setFilterByClasss(e.target.value)}
                className="block w-full h-12 px-2 py-1 text-sm focus:outline-none leading-5 
                        rounded-md focus:border-gray-200 border-gray-200 bg-gray-100 ring-1 ring-gray-200
                        focus:bg-white border-transparent form-select "
              >
                <option value="">Lớp</option>
                {classs.map((item) => (
                  <option value={item.id} key={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
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
            {/* <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
              <select
                className="block w-full px-3 py-1 text-sm h-12 rounded-md bg-gray-100 focus:bg-gray-50 border-[1px] focus:bg-transparent focus:outline-none"
                onChange={(e) => {
                  setFilterByRole(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value={""}>Tất cả</option>
                <option value={USER_ROLES.STAFF}>Nhân viên</option>
                <option value={USER_ROLES.ADMIN}>Quản lý</option>
              </select>
            </div> */}
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
          <StudentDeletedTable
            students={students}
            handleDelete={handleDelete}
            handleRestore={handleRestore}
            handleSelected={handleSelected}
            isSelected={isSelected}
            handleSelectAll={handleSelectAll}
            isSelectAll={isSelectAll}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPageCount={totalPageCount}
            limitPerPage={limitPerPage}
            setLimitPerPage={setLimitPerPage}
            currentUser={currentUser}
          />
        </React.Fragment>
      ) : (
        <React.Fragment>
          <h1 className="text-black font-bold mb-5">Danh sách</h1>
          <StudentTable
            students={students}
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
      )}
      {isShowAddModal && (
        <AddModalStaff
          closeModal={handleShowAddModal}
          title="THÊM SINH VIÊN"
          titleBtnFooter="THÊM"
          handleAddStudent={handleAddStudent}
          getAllStudent={getAllStudent}
        />
      )}
    </PageLayout>
  );
}
