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
export default function EditAcc({ employee, handleUpdateEmployee ,setIsLoading ,closeModal}) {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const handleShowPasswordConfirm = () => {
    setShowPasswordConfirm(!showPasswordConfirm);
  };
  const schema = yup.object().shape({
    email: yup.string().required("Vui lòng nhập Email của bạn.").email("Vui lòng nhập đúng định dạng của Email."),
    username: yup
      .string()
      .required("Vui lòng nhập tên tài khoản của bạn.")
      .min(6, "Tên tài khoản có ít nhất 6 kí tự.")
      .max(30, "Tên tài khoản không dài hơn 30 kí tự."),
    password: yup.string().required("Vui lòng nhập mật khẩu của bạn.").min(8, "Mật khẩu có ít nhất 8 kí tự."),
    passwordConfirm: yup
      .string()
      .required("Vui lòng nhập lại mật khẩu của bạn.")
      .oneOf([yup.ref("password")], "Mật khẩu không trùng khớp."),
    
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
        <div className={`${styles.item}`}>
              <div className="w-1/3 text-sm text-gray-700 font-medium dark:text-gray-400">
                <label>Email</label>
              </div>
              <div className="flex flex-col w-2/3 ">
                <input
                  type="email"
                  defaultValue={employee.account_id.email}
                  placeholder="Nhập email"
                  className={`${
                    errors.email ? "border-red-500" : ""
                  } block w-full px-3 py-1 text-sm h-12 rounded-md bg-gray-100 focus:bg-gray-50 border-[1px] focus:bg-transparent focus:outline-none`}
                  {...register("email")}
                />
                {errors.email && <p className="text-red-500 text-sm">{`*${errors.email.message}`}</p>}
              </div>
            </div>
            <div className={`${styles.item}`}>
              <div className="w-1/3 text-sm text-gray-700 font-medium dark:text-gray-400">
                <label>Username</label>
              </div>
              <div className="flex flex-col w-2/3 ">
                <input
                  type="text"
                  defaultValue={employee.account_id.username}
                  placeholder="Nhập tên tài khoản"
                  className={`${
                    errors.username ? "border-red-500" : ""
                  } block w-full px-3 py-1 text-sm h-12 rounded-md bg-gray-100 focus:bg-gray-50 border-[1px] focus:bg-transparent focus:outline-none`}
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
                    }  block w-full px-3 py-1 text-sm h-12 border-r-0 rounded-l bg-gray-100 focus:bg-gray-50 border-[1px] focus:bg-transparent focus:outline-none pr-[10px]`}
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
                      errors.passwordConfirm ? "border-red-500" : ""
                    }  block w-full px-3 py-1 text-sm h-12  rounded-l bg-gray-100 focus:bg-gray-50 border-[1px] focus:bg-transparent focus:outline-none pr-[10px]`}
                    {...register("passwordConfirm")}
                  />
                  <div className="absolute right-0 bg-transparent w-1/12 h-[48px] flex items-center justify-center rounded-r border-0">
                    {showPasswordConfirm ? (
                      <button type="button" className="w-[20px] h-[20px] mx-[10px]" onClick={handleShowPasswordConfirm}>
                        {<IconEye />}
                      </button>
                    ) : (
                      <button type="button" className="w-[20px] h-[20px] mx-[10px]" onClick={handleShowPasswordConfirm}>
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
    </form>
    // <form onSubmit={handleSubmit(onSubmit)}>
    //           <div className={`${styles.item}`}>
    //           <div className="w-1/3 text-sm text-gray-700 font-medium dark:text-gray-400">
    //             <label>Email</label>
    //           </div>
    //           <div className="flex flex-col w-2/3 ">
    //             <input
    //               type="email"
    //               placeholder="Nhập email"
    //               className={`${
    //                 errors.email ? "border-red-500" : ""
    //               } block w-full px-3 py-1 text-sm h-12 rounded-md bg-gray-100 focus:bg-gray-50 border-[1px] focus:bg-transparent focus:outline-none`}
    //               {...register("email")}
    //             />
    //             {errors.email && <p className="text-red-500 text-sm">{`*${errors.email.message}`}</p>}
    //           </div>
    //         </div>
    //         <div className={`${styles.item}`}>
    //           <div className="w-1/3 text-sm text-gray-700 font-medium dark:text-gray-400">
    //             <label>Username</label>
    //           </div>
    //           <div className="flex flex-col w-2/3 ">
    //             <input
    //               type="text"
    //               placeholder="Nhập tên tài khoản"
    //               className={`${
    //                 errors.username ? "border-red-500" : ""
    //               } block w-full px-3 py-1 text-sm h-12 rounded-md bg-gray-100 focus:bg-gray-50 border-[1px] focus:bg-transparent focus:outline-none`}
    //               {...register("username")}
    //             />
    //             {errors.username && <p className="text-red-500 text-sm">{`*${errors.username.message}`}</p>}
    //           </div>
    //         </div>
    //         <div className={`${styles.item}`}>
    //           <div className="w-1/3 text-sm text-gray-700 font-medium dark:text-gray-400">
    //             <label>Mật khẩu</label>
    //           </div>
    //           <div className="flex flex-col w-2/3 ">
    //             <div className="flex items-center justify-center relative">
    //               <input
    //                 type={showPassword ? "text" : "password"}
    //                 placeholder="Nhập mật khẩu"
    //                 spellCheck="false"
    //                 className={`${
    //                   errors.password ? "border-red-500" : ""
    //                 }  block w-full px-3 py-1 text-sm h-12 border-r-0 rounded-l bg-gray-100 focus:bg-gray-50 border-[1px] focus:bg-transparent focus:outline-none pr-[10px]`}
    //                 {...register("password")}
    //               />
    //               <div className="absolute right-0 bg-transparent w-1/12 h-[48px] flex items-center justify-center rounded-r border-0">
    //                 {showPassword ? (
    //                   <button type="button" className="w-[20px] h-[20px] mx-[10px] " onClick={handleShowPassword}>
    //                     {<IconEye />}
    //                   </button>
    //                 ) : (
    //                   <button type="button" className="w-[20px] h-[20px] mx-[10px] " onClick={handleShowPassword}>
    //                     {<IconEyeClose />}
    //                   </button>
    //                 )}
    //               </div>
    //             </div>
    //             {errors.password && <p className="text-red-500 text-sm">{`*${errors.password.message}`}</p>}
    //           </div>
    //         </div>
    //         <div className={`${styles.item}`}>
    //           <div className="w-1/3 text-sm text-gray-700 font-medium dark:text-gray-400">
    //             <label>Nhập lại mật khẩu</label>
    //           </div>
    //           <div className="flex flex-col w-2/3 ">
    //             <div className="flex items-center justify-center relative">
    //               <input
    //                 type={showPasswordConfirm ? "text" : "password"}
    //                 placeholder="Nhập lại mật khẩu"
    //                 spellCheck="false"
    //                 className={`${
    //                   errors.passwordConfirm ? "border-red-500" : ""
    //                 }  block w-full px-3 py-1 text-sm h-12  rounded-l bg-gray-100 focus:bg-gray-50 border-[1px] focus:bg-transparent focus:outline-none pr-[10px]`}
    //                 {...register("passwordConfirm")}
    //               />
    //               <div className="absolute right-0 bg-transparent w-1/12 h-[48px] flex items-center justify-center rounded-r border-0">
    //                 {showPasswordConfirm ? (
    //                   <button type="button" className="w-[20px] h-[20px] mx-[10px]" onClick={handleShowPasswordConfirm}>
    //                     {<IconEye />}
    //                   </button>
    //                 ) : (
    //                   <button type="button" className="w-[20px] h-[20px] mx-[10px]" onClick={handleShowPasswordConfirm}>
    //                     {<IconEyeClose />}
    //                   </button>
    //                 )}
    //               </div>
    //             </div>
    //             {errors.passwordConfirm && (
    //               <p className="text-red-500 text-sm">{`*${errors.passwordConfirm.message}`}</p>
    //             )}
    //           </div>
    //         </div>
    //         </form>
  )
}