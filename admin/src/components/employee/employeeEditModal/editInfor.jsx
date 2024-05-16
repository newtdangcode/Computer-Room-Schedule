import { useState, useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";

import Drawer from "../../modal/drawer";
import ModalHeader from "../../modal/header";
import ModalFooter from "../../modal/footer";
import { IconUploadFile, IconEye, IconEyeClose } from "../../icon";
import { useForm } from "react-hook-form";
import yup from "../../../utils/yupGlobal";
import toastMessage from "../../../utils/toastMessage";
import styles from "./styles.module.css";
export default function EditInfor({ employee, handleUpdateEmployee, setIsLoading, closeModal }) {
    
    
  
    const schema = yup.object().shape({
        first_name: yup.string().required("Vui lòng nhập họ của bạn"),
        last_name: yup.string().required("Vui lòng nhập tên của bạn"),  
        phone_number: yup
        .string()
        .required("Vui lòng nhập số điện thoại của bạn.")
        .phone("Vui lòng nhập đúng định dạng số điện thoại."),
        role_id: yup.string().required("Vui lòng chọn chức vụ."),
    });
    const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm({
        resolver: yupResolver(schema),
      });

      const onSubmit = async (data) => {
        //event.preventDefault();
        //console.log("submit ok");
        try {
          console.log(data);
          setIsLoading(true);
          
          await handleUpdateEmployee(employee.code, data);
          toastMessage({ type: "success", message: "Cập nhật nhân viên thành công." });
          closeModal();
        } catch (error) {
          const errorMessage = error.response.data.message;
          console.log(error);
          toastMessage({ type: "error", message: `Cập nhật nhân viên thất bại. ${errorMessage}.` });
        } finally {
          setIsLoading(false);
        }
      };
    return(
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className={`${styles.item} flex`}>
              <div className="w-1/3 text-sm text-gray-700 font-medium dark:text-gray-400">
                <label>Họ</label>
              </div>
              <div className="flex flex-col w-2/3 ">
                <input
                  type="text"
                  defaultValue={employee.first_name}
                  placeholder="Nhập họ"
                  className={`  ${
                    errors.first_name ? "border-red-500" : ""
                  } block w-full px-3 py-1 text-sm h-12 rounded-md bg-gray-100 focus:bg-gray-50 border-[1px] focus:bg-transparent focus:outline-none`}
                  {...register("first_name")}
                />
                {errors.first_name && <p className="text-red-500 text-sm">{`*${errors.first_name.message}`}</p>}
              </div>
            </div>
            <div className={`${styles.item} flex`}>
              <div className="w-1/3 text-sm text-gray-700 font-medium dark:text-gray-400">
                <label>Tên</label>
              </div>
              <div className="flex flex-col w-2/3 ">
                <input
                  type="text"
                  defaultValue={employee.last_name}
                  placeholder="Nhập tên"
                  className={`  ${
                    errors.last_name ? "border-red-500" : ""
                  } block w-full px-3 py-1 text-sm h-12 rounded-md bg-gray-100 focus:bg-gray-50 border-[1px] focus:bg-transparent focus:outline-none`}
                  {...register("last_name")}
                />
                {errors.last_name && <p className="text-red-500 text-sm">{`*${errors.last_name.message}`}</p>}
              </div>
            </div>
            <div className={`${styles.item} flex`}>
              <div className="w-1/3 text-sm text-gray-700 font-medium dark:text-gray-400">
                <label>Mã nhân viên</label>
              </div>
              <div className="flex flex-col w-2/3 ">
                <input
                  type="text"
                  defaultValue={employee.code}
                  readOnly
                  className={`  ${
                    errors.code ? "border-red-500" : ""
                  } block w-full px-3 py-1 text-sm h-12 rounded-md bg-gray-100 focus:bg-gray-50 border-[1px] focus:bg-transparent focus:outline-none`}
                  
                />
              </div>
            </div>
            <div className={`${styles.item} flex`}>
              <div className="w-1/3 text-sm text-gray-700 font-medium dark:text-gray-400">
                <label>Chức vụ</label>
              </div>
              <div className="flex flex-col w-2/3 ">
                <select
                  {...register("role_id")}
                  className="block w-full px-3 py-1 text-sm h-12 rounded-md bg-gray-100 focus:bg-gray-50 border-[1px] focus:bg-transparent focus:outline-none"
                >
                  
                  <option value={2}>Nhân viên</option>
                </select>
              </div>
            </div>
            <input type="submit" hidden id="send" />
          </form>
          
    )
}