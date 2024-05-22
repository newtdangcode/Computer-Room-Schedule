import { useState, useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import Drawer from "../../modal/drawer";
import ModalHeader from "../../modal/header";
import ModalFooter from "../../modal/footer";
import { useForm } from "react-hook-form";
import yup from "../../../utils/yupGlobal";
import toastMessage from "../../../utils/toastMessage";
import styles from "./styles.module.css";

export default function AddModalClass({ closeModal, title, titleBtnFooter, handleAddClass }) {
  useEffect(() => {
 
  }, []);


 
  const [isLoading, setIsLoading] = useState(false);

  const schema = yup.object().shape({
    code: yup.string().required("Vui lòng nhập mã lớp."),
    name: yup.string().required("Vui lòng nhập tên lớp"),
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
      
      await handleAddClass(data);
      toastMessage({ type: "success", message: "Thêm lớp thành công." });
      closeModal();
    } catch (error) {
      const errorMessage = error.response.data.message;
      console.log(error);
      toastMessage({ type: "error", message: `Thêm lớp thất bại. ${errorMessage}.` });
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
                <label>Tên lớp</label>
              </div>
              <div className="flex flex-col w-2/3 ">
                <input
                  type="text"
                  placeholder="Nhập Tên lớp"
                  className={`  ${
                    errors.name ? "border-red-500" : ""
                  } block w-full px-3 py-1 text-sm h-12 rounded-md bg-gray-100 focus:bg-gray-50 border-[1px] focus:bg-transparent focus:outline-none`}
                  {...register("name")}
                />
                {errors.name && <p className="text-red-500 text-sm">{`*${errors.name.message}`}</p>}
              </div>
            </div>
           
            <div className={`${styles.item}`}>
              <div className="w-1/3 text-sm text-gray-700 font-medium dark:text-gray-400">
                <label>Mã lớp</label>
              </div>
              <div className="flex flex-col w-2/3 ">
                <input
                  type="text"
                  placeholder="Nhập mã lớp"
                  className={`  ${
                    errors.code ? "border-red-500" : ""
                  } block w-full px-3 py-1 text-sm h-12 rounded-md bg-gray-100 focus:bg-gray-50 border-[1px] focus:bg-transparent focus:outline-none`}
                  {...register("code")}
                />
                {errors.code && <p className="text-red-500 text-sm">{`*${errors.code.message}`}</p>}
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
