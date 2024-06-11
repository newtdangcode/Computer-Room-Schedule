import React, { useEffect, useState } from "react";
import { IconClose, IconDelete } from "../../icon";
import StudentTable from "../StudentTable";
import styles from "./styles.module.css";
import classAPI from "../../../api/classAPI";
import subjectAPI from "../../../api/subjectAPI";
import Swal from "sweetalert2";

export default function StudentListModal({ closeModal, class_code, subject_id }) {
  const [isLoading, setIsLoading] = useState(true);
  const [subjectStudentList, setSubjectStudentList] = useState(null);
  const [classStudentList, setClassStudentList] = useState(null);
  const [students, setStudents] = useState([]);
  const [isSelectAll, setIsSelectAll] = useState(false);
  const [isSelected, setIsSelected] = useState([]);

  useEffect(() => {
    if (isSelected.length === students.length && students.length > 0) {
      setIsSelectAll(true);
    }
    if (isSelected.length === 0) {
      setIsSelectAll(false);
    }
  }, [isSelected]);

  const handleSelectAll = () => {
    setIsSelectAll(!isSelectAll);
    if (!isSelectAll) {
      const allStudentCodes = students.map((student) => student.code);
      setIsSelected(allStudentCodes);
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
      setIsSelected(isSelected.filter((student_code) => student_code !== code));
    }
  };

  const handleDeleteFromSubjectStudentList = async (student_code) => {
    try {
      const response = await subjectAPI.deleteStudentFromSubject(subject_id, {student_code: student_code});
      fetchStudentList();
    } catch (err) {
      console.log(err);
    }
  };
  const handleDeleteManyFromSubjectStudentList = async () => {
    try {
      console.log("deletemany",isSelected)
      const response = await subjectAPI.deleteManyStudentsFromSubject(subject_id, {student_codes: isSelected});
      fetchStudentList();
    } catch (err) {
      console.log(err);
    }
  };
  const fetchStudentList = async () => {
    try {
      if (class_code) {
        const response = await classAPI.getStudentList(class_code);
        setClassStudentList(response);
      } else if (subject_id) {
        // Assuming there's a similar API for subjects
        const response = await subjectAPI.getSubjectStudentList(subject_id);
        setSubjectStudentList(response);
        setStudents(response.students);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchStudentList();
  }, [class_code, subject_id]);

  useEffect(() => {
    if (subjectStudentList || classStudentList) {
      setIsLoading(false);
    }
  }, [subjectStudentList, classStudentList]);
  return (
    <React.Fragment>
      <div onClick={closeModal} className="bg-black/30 top-0 right-0 left-0 z-20 bottom-0 fixed w-full h-full"></div>

      <div
        className={`h-[85%] mt-[40px] px-[10px] rounded-[8px] z-20 fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[70%] basis-[70%] min-w-[60%] bg-white`}
      >
        <div className="flex">
          <div className="justify-end absolute z-5 right-0 top-0">
            <div
              onClick={closeModal}
              className="flex items-center w-[50px] text-left rounded-bl-[8px] rounded-tr-[8px] bg-[#ee4d2d] text-[#fff] h-[40px] text-[25px] cursor-pointer hover:bg-[#e8340c]"
            >
              <IconClose />
            </div>
          </div>
        </div>

        <div className={`${styles.navbar} w-full h-full`}>
          <div className="h-[50px] text-primary text-[40px] px-4">Danh sách Lớp</div>
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <div>Loading...</div>
            </div>
          ) : (
            <>
              {subjectStudentList && (
                <div className="w-full grid justify-items-end px-6">
                  <div className="w-auto grid justify-start">
                    <div className="w-auto text-black text-[17px]">
                      Môn học: {subjectStudentList?.name} ({subjectStudentList?.code})
                    </div>
                    <div className="w-auto text-black text-[17px]">
                      Giảng viên: {subjectStudentList?.lecturer_code?.first_name}{" "}
                      {subjectStudentList?.lecturer_code?.last_name} ({subjectStudentList?.lecturer_code?.code})
                    </div>
                  </div>
                </div>
              )}
              {classStudentList && (
                <div className="w-full grid justify-items-end px-6">
                  <div className="w-auto grid justify-start">
                    <div className="w-auto text-black text-[17px]">Lớp: {classStudentList?.code}</div>
                    <div className="w-auto text-black text-[17px]">
                      Cố vấn học tập: {classStudentList?.lecturer_code?.first_name}{" "}
                      {classStudentList?.lecturer_code?.last_name}
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-white rounded-lg ring-1 ring-gray-200 ring-opacity-4 overflow-huser_idden mb-5 shadow-xs">
                <div className="p-4">
                  <div className="flex justify-end items-center py-3 gap-x-4">
                    <button
                      disabled={isSelected.length <= 0}
                      onClick={() => {
                        Swal.fire({
                          title: "Bạn chắc chắn muốn xoá?",
                          text: "Sinh viên sẽ được xoá khỏi lớp.",
                          icon: "question",
                          showCancelButton: true,
                          confirmButtonColor: "#0E9F6E",
                          cancelButtonColor: "#d33",
                          cancelButtonText: "Huỷ bỏ",
                          confirmButtonText: "Đồng ý!",
                        }).then((result) => {
                          if (result.isConfirmed) {
                            handleDeleteManyFromSubjectStudentList();
                            Swal.fire({
                              title: "Đã được xoá khỏi lớp",
                              text: "Sinh viên đã được được xoá khỏi lớp.",
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
                  </div>
                </div>
              </div>

              <div className="container bg-[white] mb-[20px] p-[20px]">
                {subjectStudentList && (
                  <StudentTable
                    isSubjectStudentList={true}
                    haveActions={true}
                    students={students}
                    isSelectAll={isSelectAll}
                    isSelected={isSelected}
                    handleSelectAll={handleSelectAll}
                    handleSelected={handleSelected}
                    handleDeleteFromSubjectStudentList={handleDeleteFromSubjectStudentList}
                  />
                )}
                {classStudentList && <StudentTable haveActions={false} students={classStudentList.students} />}
              </div>
            </>
          )}
        </div>
      </div>
    </React.Fragment>
  );
}
