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
import EditInfor from "./editInfor";
import EditAcc from "./editAcc";

export default function EditModalEmployee({ closeModal, title, titleBtnFooter, handleUpdateEmployee, employee }) {
  useEffect(() => {
 
  }, []);
  //console.log('employee',employee);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditInfor, setIsEditInfor] = useState(true);
  //const onSubmit = async (data) => {};
  return (
    <div>
      <div onClick={closeModal} className={`bg-black/30 top-0 right-0 left-0 w-full h-full fixed `}></div>
      <Drawer closeModal={closeModal} title={title} titleBtnFooter={titleBtnFooter}>
        <ModalHeader closeModal={closeModal} title={title} />
        <div className="h-full overflow-y-scroll grow mt-[20px]">
          <div  className="w-full h-[30px] flex">
            <button onClick={((e)=>{setIsEditInfor(!isEditInfor)})} className={`ml-[30px] text-[18px] ${isEditInfor?'underline cursor-none text-primary ':'text-black hover:text-[20px]'}`}>Thông tin</button>
            <button onClick={((e)=>{setIsEditInfor(!isEditInfor)})} className={`ml-[30px] text-[18px] ${!isEditInfor?'underline cursor-none text-primary':'text-black hover:text-[20px]'}`}>Tài khoản</button>
          </div>
          <div className="mt-[50px]"></div>
            {isEditInfor ? (
              <EditInfor
                employee={employee}
                handleUpdateEmployee={handleUpdateEmployee}
ư                setIsLoading={setIsLoading}
                closeModal={closeModal}
                //onSubmit={onSubmit}
              />
            ):(
              <EditAcc
                employee={employee}
                handleUpdateEmployee={handleUpdateEmployee}
                setIsLoading={setIsLoading}
                closeModal={closeModal}
                //onSubmit={onSubmit}
              />
            )}
            
        
          
        </div>
        <ModalFooter title={titleBtnFooter} isLoading={isLoading} />
      </Drawer>
    </div>
  );
}
