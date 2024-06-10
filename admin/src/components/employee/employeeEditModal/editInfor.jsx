import { useForm } from "react-hook-form";
import { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link } from "react-router-dom";

import Drawer from "../../modal/drawer";
import ModalHeader from "../../modal/header";
import ModalFooter from "../../modal/footer";
import { IconUploadFile, IconEye, IconEyeClose } from "../../icon";
import styles from "./styles.module.css";
import yup from "../../../utils/yupGlobal";
import toastMessage from "../../../utils/toastMessage";

export default function EditInfor({
  user,
  title,
  titleBtnFooter,
  handleUpdateUser,
  isEditInfor,
  setIsEditInfor,
  closeModal,
  haveCloseModal = true,
}) {
  const schema = yup.object().shape({
    first_name: yup.string().required("Vui lòng nhập họ của bạn."),
    last_name: yup.string().required("Vui lòng nhập tên của bạn."),
    phone_number: yup
      .string()
      .required("Vui lòng nhập số điện thoại của bạn.")
      .phone("Vui lòng nhập đúng định dạng số điện thoại."),
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
      handleUpdateUser(user.code, data);
      toastMessage({ type: "success", message: "Cập nhật thành công." });
    } catch (error) {
      toastMessage({ type: "error", message: `Cập nhật thất bại. ${error}.` });
    } finally {
      setIsLoading(false);
      closeModal();
    }
  };

  return (
    <>
      <Drawer isFullWidth={haveCloseModal} closeModal={closeModal} title={title} titleBtnFooter={titleBtnFooter}>
        {haveCloseModal ? <ModalHeader closeModal={closeModal} title={title} /> : null}

        <div className={`h-full mt-[20px] ${haveCloseModal?"overflow-y-scroll grow":""}`}>
          <div className="w-full h-[30px] flex">
            <button
              onClick={(e) => {
                setIsEditInfor(!isEditInfor);
              }}
              className={`ml-[30px] text-[18px] ${
                isEditInfor ? "underline cursor-none text-primary " : "text-black hover:text-[20px]"
              }`}
            >
              Thông tin
            </button>
            <button
              onClick={(e) => {
                setIsEditInfor(!isEditInfor);
              }}
              className={`ml-[30px] text-[18px] ${
                !isEditInfor ? "underline cursor-none text-primary" : "text-black hover:text-[20px]"
              }`}
            >
              Tài khoản
            </button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className={`${styles.item}`}>
              <div className="w-1/3 text-sm text-gray-700 font-medium dark:text-gray-400">
                <label>Họ</label>
              </div>
              <div className="flex flex-col w-2/3">
                <input
                  defaultValue={user.first_name}
                  type="text"
                  placeholder="Nhập họ"
                  className={`${
                    errors.first_name ? "border-red-500" : ""
                  } block w-full px-3 py-1 text-sm h-12 rounded-md bg-gray-100 focus:bg-gray-50 border-[1px] focus:bg-transparent focus:outline-none`}
                  {...register("first_name")}
                />
                {errors.first_name && <p className="text-red-500 text-sm">{`*${errors.first_name.message}`}</p>}
              </div>
            </div>
            <div className={`${styles.item}`}>
              <div className="w-1/3 text-sm text-gray-700 font-medium dark:text-gray-400">
                <label>Tên</label>
              </div>
              <div className="flex flex-col w-2/3">
                <input
                  defaultValue={user.last_name}
                  type="text"
                  placeholder="Nhập tên"
                  className={`${
                    errors.name ? "border-red-500" : ""
                  } block w-full px-3 py-1 text-sm h-12 rounded-md bg-gray-100 focus:bg-gray-50 border-[1px] focus:bg-transparent focus:outline-none`}
                  {...register("last_name")}
                />
                {errors.last_name && <p className="text-red-500 text-sm">{`*${errors.last_name.message}`}</p>}
              </div>
            </div>
            <div className={`${styles.item}`}>
              <div className="w-1/3 text-sm text-gray-700 font-medium dark:text-gray-400">
                <label>Mã nhân viên </label>
              </div>
              <div className="flex flex-col w-2/3 ">
                <div
                  className={`flex text-center items-center w-full px-3 py-1 text-sm font-[600] text-gray-400 h-12 rounded-md bg-gray-100 focus:bg-gray-50 border-[1px] `}
                  
                >{user.code}</div>
                
              </div>
            </div>
            <div className={`${styles.item}`}>
              <div className="w-1/3 text-sm text-gray-700 font-medium dark:text-gray-400">
                <label>Số điện thoại</label>
              </div>
              <div className="flex flex-col w-2/3">
                <input
                  defaultValue={user.phone_number}
                  type="tel"
                  placeholder="Nhập SĐT"
                  className={`${
                    errors.phone ? "border-red-500" : ""
                  } block w-full px-3 py-1 text-sm h-12 rounded-md bg-gray-100 focus:bg-gray-50 border-[1px] focus:bg-transparent focus:outline-none`}
                  {...register("phone_number")}
                />
                {errors.phone_number && <p className="text-red-500 text-sm">{`*${errors.phone_number.message}`}</p>}
              </div>
            </div>
            <div className={`${styles.item}`}>
              <div className="w-1/3 text-sm text-gray-700 font-medium dark:text-gray-400">
                <label>Chức vụ</label>
              </div>
              <div className="flex flex-col w-2/3">
                <select
                  defaultValue={user.role_id}
                  className="block w-full px-3 py-1 text-sm h-12 rounded-md bg-gray-100 focus:bg-gray-50 border-[1px] focus:bg-transparent focus:outline-none"
                  {...register("role_id")}
                >
                  <option value={user.account_id.role_id.id}>{user.account_id.role_id.name}</option>
                </select>
              </div>
            </div>
            <input type="submit" hidden id="send" disabled={isLoading} />
          </form>
        </div>
        <ModalFooter title={titleBtnFooter} isLoading={isLoading} />
      </Drawer>
    </>
  );
}
