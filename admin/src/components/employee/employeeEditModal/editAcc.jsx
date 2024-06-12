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

export default function EditAcc({
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
    username: yup
      .string()
      .required("Vui lòng nhập tên tài khoản của bạn.")
      .min(8, "Tên tài khoản có ít nhất 8 kí tự.")
      .max(30, "Tên tài khoản không dài hơn 30 kí tự."),
    email: yup.string().required("Vui lòng nhập Email của bạn.").email("Vui lòng nhập đúng định dạng của Email."),
    password: yup.string().required("Vui lòng nhập mật khẩu của bạn.").min(8, "Mật khẩu có ít nhất 8 kí tự."),
    passwordConfirm: yup.string().oneOf([yup.ref("password")], "Mật khẩu không trùng khớp."),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const handleShowPasswordConfirm = () => {
    setShowPasswordConfirm(!showPasswordConfirm);
  };
  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      await handleUpdateUser(user.code, data);
      toastMessage({ type: "success", message: "Cập nhật thành công." });
    } catch (error) {
      const errorMessage = error.response.data.message;
      toastMessage({ type: "error", message: `Cập nhật thất bại. ${errorMessage}.` });
    } finally {
      setIsLoading(false);
      closeModal();
    }
  };

  return (
    <>
      <Drawer isFullWidth={haveCloseModal} closeModal={closeModal} title={title} titleBtnFooter={titleBtnFooter}>
        {haveCloseModal ? <ModalHeader closeModal={closeModal} title={title} /> : null}
        <div className={`h-full mt-[20px] ${haveCloseModal ? "overflow-y-scroll grow" : ""}`}>
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
                <label>Email</label>
              </div>
              <div className="flex flex-col w-2/3">
                {haveCloseModal ? (
                  <input
                    defaultValue={user.account_id.email}
                    type="email"
                    placeholder="Nhập email"
                    className={`${
                      errors.email ? "border-red-500" : ""
                    } block w-full px-3 py-1 text-sm h-12 rounded-md bg-gray-100 focus:bg-gray-5 border-[1px] focus:bg-transparent focus:outline-none`}
                    {...register("email")}
                  />
                ) : (
                  <input
                    defaultValue={user.account_id.email}
                    type="email"
                    readOnly
                    className={` block w-full px-3 py-1 text-sm font-[600] text-gray-400 h-12 rounded-md bg-gray-100 focus:bg-gray-5 border-[1px] `}
                    {...register("email")}
                  />
                )}

                {errors.email && <p className="text-red-500 text-sm">{`*${errors.email.message}`}</p>}
              </div>
            </div>
            <div className={`${styles.item}`}>
              <div className="w-1/3 text-sm text-gray-700 font-medium dark:text-gray-400">
                <label>Username</label>
              </div>
              <div className="flex flex-col w-2/3">
                <input
                  defaultValue={user.account_id.username}
                  type="username"
                  placeholder="Nhập username"
                  className={`${
                    errors.username ? "border-red-500" : ""
                  } block w-full px-3 py-1 text-sm h-12 rounded-md bg-gray-100 focus:bg-gray-5 border-[1px] focus:bg-transparent focus:outline-none`}
                  {...register("username")}
                />
                {errors.username && <p className="text-red-500 text-sm">{`*${errors.username.message}`}</p>}
              </div>
            </div>
            <div className={`${styles.item}`}>
              <div className="w-1/3 text-sm text-gray-700 font-medium dark:text-gray-400">
                <label>Mật khẩu</label>
              </div>
              <div className="flex flex-col w-2/3 ">
                <div className="flex items-center justify-center relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Nhập mật khẩu"
                    spellCheck="false"
                    className={`${
                      errors.password ? "border-red-500" : ""
                    }  block w-full px-3 py-1 text-sm h-12 rounded bg-gray-100 focus:bg-gray-50 border-[1px] focus:bg-transparent focus:outline-none pr-[10px]`}
                    {...register("password")}
                  />
                  <div className="absolute right-0 bg-transparent w-1/12 h-[48px] flex items-center justify-center rounded-r border-0">
                    {showPassword ? (
                      <button type="button" className="w-[20px] h-[20px] mx-[10px] " onClick={handleShowPassword}>
                        {<IconEye />}
                      </button>
                    ) : (
                      <button type="button" className="w-[20px] h-[20px] mx-[10px] " onClick={handleShowPassword}>
                        {<IconEyeClose />}
                      </button>
                    )}
                  </div>
                </div>
                {errors.password && <p className="text-red-500 text-sm">{`*${errors.password.message}`}</p>}
              </div>
            </div>

            <div className={`${styles.item}`}>
              <div className="w-1/3 text-sm text-gray-700 font-medium dark:text-gray-400">
                <label>Nhập lại mật khẩu</label>
              </div>
              <div className="flex flex-col w-2/3 ">
                <div className="flex items-center justify-center relative">
                  <input
                    type={showPasswordConfirm ? "text" : "password"}
                    placeholder="Nhập lại mật khẩu"
                    spellCheck="false"
                    className={`${
                      errors.password ? "border-red-500" : ""
                    } block w-full px-3 py-1 text-sm h-12  rounded bg-gray-100 focus:bg-gray-50 border-[1px] focus:bg-transparent focus:outline-none pr-[10px]`}
                    {...register("passwordConfirm")}
                  />
                  <div className="absolute right-0 bg-transparent w-1/12 h-[48px] flex items-center justify-center rounded-r border-0">
                    {showPasswordConfirm ? (
                      <button
                        type="button"
                        className="w-[20px] h-[20px] mx-[10px] "
                        onClick={handleShowPasswordConfirm}
                      >
                        {<IconEye />}
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="w-[20px] h-[20px] mx-[10px] "
                        onClick={handleShowPasswordConfirm}
                      >
                        {<IconEyeClose />}
                      </button>
                    )}
                  </div>
                </div>
                {errors.passwordConfirm && (
                  <p className="text-red-500 text-sm">{`*${errors.passwordConfirm.message}`}</p>
                )}
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
