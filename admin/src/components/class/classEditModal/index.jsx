import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import Drawer from "../../modal/drawer";
import ModalHeader from "../../modal/header";
import ModalFooter from "../../modal/footer";
import styles from "./styles.module.css";
import yup from "../../../utils/yupGlobal";
import toastMessage from "../../../utils/toastMessage";
import lecturerAPI from "../../../api/lecturerAPI";
export default function EditModalClass({ haveCloseModal = true, closeModal, title, titleBtnFooter, handleUpdateClass, editClass }) {
  useEffect(() => {
    getAllLecturer();
  }, []);
  const [lecturers, setLecturers] = useState([]); 
  const getAllLecturer = async () => {
    try {
      const response = await lecturerAPI.getAllWithoutParams();
      setLecturers(response.data.filter((item) => item.code !== editClass.lecturer_code.code));
    }catch (error) {
      console.log(error);
    }
  };
  const schema = yup.object().shape({
    name: yup.string().required("Vui lòng nhập tên lớp."),
    
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      handleUpdateClass(editClass.code, data);
      toastMessage({ type: "success", message: "Cập nhật thành công." });
    } catch (error) {
      toastMessage({ type: "error", message: `Cập nhật thất bại. ${error}.` });
    } finally {
      setIsLoading(false);
      closeModal();
    }
  };
  
  return (
    <div>
      <div onClick={closeModal} className={`bg-black/30 top-0 right-0 left-0 w-full h-full fixed `}></div>
      <Drawer isFullWidth={haveCloseModal} closeModal={closeModal} title={title} titleBtnFooter={titleBtnFooter}>
        {haveCloseModal ? <ModalHeader closeModal={closeModal} title={title} /> : null}

        <div className={`h-full mt-[20px] ${haveCloseModal?"overflow-y-scroll grow":""}`}>
         
          <form onSubmit={handleSubmit(onSubmit)}>
            
            <div className={`${styles.item}`}>
              <div className="w-1/3 text-sm text-gray-700 font-medium dark:text-gray-400">
                <label>Tên</label>
              </div>
              <div className="flex flex-col w-2/3">
                <input
                  defaultValue={editClass.name}
                  type="text"
                  placeholder="Nhập tên lớp"
                  className={`${
                    errors.name ? "border-red-500" : ""
                  } block w-full px-3 py-1 text-sm h-12 rounded-md bg-gray-100 focus:bg-gray-50 border-[1px] focus:bg-transparent focus:outline-none`}
                  {...register("name")}
                />
                {errors.name && <p className="text-red-500 text-sm">{`*${errors.name.message}`}</p>}
              </div>
            </div>
            <div className={`${styles.item}`}>
              <div className="w-1/3 text-sm text-gray-700 font-medium dark:text-gray-400">
                <label>Giảng viên</label>
              </div>
              <div className="flex flex-col w-2/3 ">
                <select
                  defaultValue={editClass.lecturer_code.code}
                  {...register("lecturer_code")}
                  className="block w-full px-3 py-1 text-sm h-12 rounded-md bg-gray-100 focus:bg-gray-50 border-[1px] focus:bg-transparent focus:outline-none"
                >
                    <option value={editClass.lecturer_code.code}>
                      {editClass.lecturer_code.code}-{editClass.lecturer_code.name}
                    </option>
                {lecturers.map((item) => (
                  <option value={item.code} key={item.code}>
                    {item.code}-{item.name}
                  </option>
                ))}
                    
                </select>
                {errors.lecturer_code && <p className="text-red-500 text-sm">{`*${errors.lecturer_code.message}`}</p>}
              </div>
            </div>
            
            <input type="submit" hidden id="send" disabled={isLoading} />
          </form>
        </div>
        <ModalFooter title={titleBtnFooter} isLoading={isLoading} />
      </Drawer>
    </div>
  );
}
