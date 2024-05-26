import { useState, useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import Drawer from "../../modal/drawer";
import ModalHeader from "../../modal/header";
import ModalFooter from "../../modal/footer";
import { useForm } from "react-hook-form";
import yup from "../../../utils/yupGlobal";
import toastMessage from "../../../utils/toastMessage";
import styles from "./styles.module.css";
import lecturerAPI from "../../../api/lecturerAPI";
import semesterAPI from "../../../api/semesterAPI";

export default function AddModalSubject({ closeModal, title, titleBtnFooter, handleAddSubject }) {
  useEffect(() => {
    getAllLecturer();
    getAllSemester();
  }, []);

  const [lecturers, setLecturers] = useState([]); 
  const getAllLecturer = async () => {
    try {
      const response = await lecturerAPI.getAllWithoutParams();
      setLecturers(response.data);
    }catch (error) {
      console.log(error);
    }
  };
  const [semesters, setSemesters] = useState([]);
  const getAllSemester = async () => {
    try {
      const response = await semesterAPI.getAllWithoutParams();
      setSemesters(response.data);
    }catch (error) {
      console.log(error);
    }
  };

  const [isLoading, setIsLoading] = useState(false);

  const schema = yup.object().shape({
    name: yup.string().required("Vui lòng nhập tên môn học."),
    code: yup.string().required("Vui lòng nhập mã môn học."),
    lecturer_code: yup.string().required("Vui lòng chọn giảng viên."),
    semester_id: yup.number().required("Vui lòng chọn học kỳ."),
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      console.log(data);
      setIsLoading(true);
      await handleAddSubject(data);
      toastMessage({ type: "success", message: "Thêm môn học thành công." });
      closeModal();
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      console.log(error);
      toastMessage({ type: "error", message: `Thêm môn học thất bại. ${errorMessage}.` });
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
                <label>Tên môn học</label>
              </div>
              <div className="flex flex-col w-2/3">
                <input
                  type="text"
                  placeholder="Nhập Tên môn học"
                  className={` ${errors.name ? "border-red-500" : ""} block w-full px-3 py-1 text-sm h-12 rounded-md bg-gray-100 focus:bg-gray-50 border-[1px] focus:bg-transparent focus:outline-none`}
                  {...register("name")}
                />
                {errors.name && <p className="text-red-500 text-sm">{`*${errors.name.message}`}</p>}
              </div>
            </div>
            <div className={`${styles.item}`}>
              <div className="w-1/3 text-sm text-gray-700 font-medium dark:text-gray-400">
                <label>Mã môn học</label>
              </div>
              <div className="flex flex-col w-2/3 ">
                <input
                  type="text"
                  placeholder="Nhập mã môn học"
                  className={`  ${
                    errors.code ? "border-red-500" : ""
                  } block w-full px-3 py-1 text-sm h-12 rounded-md bg-gray-100 focus:bg-gray-50 border-[1px] focus:bg-transparent focus:outline-none`}
                  {...register("code")}
                />
                {errors.code && <p className="text-red-500 text-sm">{`*${errors.code.message}`}</p>}
              </div>
            </div>
            <div className={`${styles.item}`}>
              <div className="w-1/3 text-sm text-gray-700 font-medium dark:text-gray-400">
                <label>Giảng viên</label>
              </div>
              <div className="flex flex-col w-2/3 ">
                <select
                  defaultValue={""}
                  {...register("lecturer_code")}
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
                <label>Học kỳ</label>
              </div>
              <div className="flex flex-col w-2/3 ">
                <select
                  defaultValue={""}
                  {...register("semester_id")}
                  className="block w-full px-3 py-1 text-sm h-12 rounded-md bg-gray-100 focus:bg-gray-50 border-[1px] focus:bg-transparent focus:outline-none"
                >
                    <option value="">Chọn học kỳ</option>
                {semesters.map((item) => (
                  <option value={item.id} key={item.id}>
                    {item.name}
                  </option>
                ))}
                    
                </select>
                {errors.class_code && <p className="text-red-500 text-sm">{`*${errors.class_code.message}`}</p>}
              </div>
            </div>
            <input type="submit" hidden id="send" />
          </form>
        </div>
        <ModalFooter title={titleBtnFooter} isLoading={isLoading} />
      </Drawer>
    </div>
  );
}
