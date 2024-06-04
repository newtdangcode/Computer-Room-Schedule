import React, { useEffect, useState } from "react";
import { IconClose } from "../../icon";

import styles from "./styles.module.css";
import classAPI from "../../../api/classAPI";
import subjectAPI from "../../../api/subjectAPI";
import studentAPI from "../../../api/studentAPI";
import { set } from "react-hook-form";
import StudentTable from "../../student/StudentTable";
import toastMessage from "../../../utils/toastMessage";

export default function AddToSubjectModal({ closeModal, student_codes , handleAddToSubject}) {
  const [isLoading, setIsLoading] = useState(true);
  const [subjects, setSubjects] = useState(null);
  const [students, setStudents] = useState([]);
  const [subject_id, setSubject_id] = useState(null);
  const getAllSubjects = async () => {
    try {
      const response = await subjectAPI.getAllWithoutParams();
      setSubjects(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  
  const getStudentList = async () => {
    try {
      const response = await studentAPI.getMany(student_codes);
      setStudents(response);
      
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllSubjects();
    getStudentList();
  }, []);

  useEffect(() => {
    if (subjects && students.length === student_codes.length) {
  
      setIsLoading(false);
    }
  }, [subjects, students]);

  const onSubmit = async () => {
    try {
      await handleAddToSubject(subject_id, student_codes);
      toastMessage({ type: "success", message: "Thêm danh sách sinh viên của môn học thành công." })
      closeModal();
    } catch (error) {
      const errorMessage = error.response.data.message;
      console.log(error);
      toastMessage({ type: "error", message: `Thêm danh sách sinh viên của môn học thất bại. ${errorMessage}.` })
    }
  };
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
          <div className="h-[50px] text-primary text-[40px] px-4">Thêm sinh viên đã chọn vào môn học</div>
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <div>Loading...</div>
            </div>
          ) : (
            <>
              {subjects && (
                <div className="mt-[50px] w-full grid justify-items-center px-6">
                  <div className="w-[50%] flex items-center justify-start h-auto">
                    
                     
                      <div className="flex flex-col w-4/6 ">
                        <select
                          defaultValue={""}
                          onChange={(e)=>setSubject_id(e.target.value)}
                          className="block px-3 py-1 text-sm h-12 rounded-md bg-gray-100 focus:bg-gray-50 border-[1px] focus:bg-transparent focus:outline-none"
                        >
                          <option value="">Chọn môn học</option>
                          {subjects.map((item) => (
                            <option value={item.id} key={item.id}>
                              {item.code} - {item.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <button  onClick={(e)=>onSubmit()} className={`rounded-md ml-[20px] w-2/6 h-full font-[700]  ${subject_id?'hover:bg-primary bg-red-400 text-white  border border-primary':'bg-white text-red-400 border border-red-400 cursor-not-allowed'} `}>Thêm vào môn học</button>
                   
                  </div>
                </div>
              )}

              <div className="container bg-[white] mb-[20px] p-[20px]">
                <div className="w-full grid justify-items-center text-[18px] text-primary ">
                  Dánh sách sinh viên đã chọn
                </div>
                {students && <StudentTable haveActions={false} students={students} />}
              </div>
            </>
          )}
        </div>
      </div>
    </React.Fragment>
  );
}
