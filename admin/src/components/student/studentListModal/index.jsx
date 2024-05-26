import React, { useEffect, useState } from "react";
import { IconClose } from "../../icon";
import StudentTable from "../StudentTable";
import styles from "./styles.module.css";
import classAPI from "../../../api/classAPI";
import subjectAPI from "../../../api/subjectAPI";

export default function StudentListModal({ closeModal, class_code, subject_id }) {
  const [isLoading, setIsLoading] = useState(true);
  const [subjectStudentList, setSubjectStudentList] = useState(null);
  const [classStudentList, setClassStudentList] = useState(null);

  useEffect(() => {
    const fetchStudentList = async () => {
      try {
        if (class_code) {
          const response = await classAPI.getStudentList(class_code);
          setClassStudentList(response);
        } else if (subject_id) {
          // Assuming there's a similar API for subjects
          const response = await subjectAPI.getSubjectStudentList(subject_id);
          setSubjectStudentList(response);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchStudentList();
  }, [class_code, subject_id]);

  useEffect(() => {
    if (subjectStudentList || classStudentList) {
      setIsLoading(false);
    }
  },[subjectStudentList, classStudentList]);
  return (
    <React.Fragment>
      <div
        onClick={closeModal}
        className="bg-black/30 top-0 right-0 left-0 z-20 bottom-0 fixed w-full h-full"
      ></div>

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
                      Giảng viên: {subjectStudentList?.lecturer_code?.first_name} {subjectStudentList?.lecturer_code?.last_name} ({subjectStudentList?.lecturer_code?.code})
                    </div>
                  </div>
                </div>
              )}
              {classStudentList && (
                <div className="w-full grid justify-items-end px-6">
                  <div className="w-auto grid justify-start">
                    <div className="w-auto text-black text-[17px]">Lớp: {classStudentList?.code}</div>
                    <div className="w-auto text-black text-[17px]">
                      Cố vấn học tập: {classStudentList?.lecturer_code?.first_name} {classStudentList?.lecturer_code?.last_name}
                    </div>
                  </div>
                </div>
              )}
              
              <div className="container bg-[white] mb-[20px] p-[20px]">
                {subjectStudentList && (
                  <StudentTable haveActions={false} students={subjectStudentList.students} />
                )}
                {classStudentList && (
                  <StudentTable haveActions={false} students={classStudentList.students} />
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </React.Fragment>
  );
}
