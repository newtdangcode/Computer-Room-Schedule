import { useState } from "react";
import EditInfor from "./editInfor";
import EditAcc from "./editAcc";

export default function EditModalEmployee({ closeModal, title, titleBtnFooter, handleUpdateEmployee, employee }) {

  const [isEditInfor, setIsEditInfor] = useState(true);
  
  return (
    <div>
      <div onClick={closeModal} className={`bg-black/30 top-0 right-0 left-0 w-full h-full fixed `}></div>
      {isEditInfor ? (
        <EditInfor
          title={title}
          titleBtnFooter={titleBtnFooter}
          user={employee}
          handleUpdateUser={handleUpdateEmployee}
          isEditInfor={isEditInfor}
          setIsEditInfor={setIsEditInfor}
          closeModal={closeModal}
        />
      ) : (
        <EditAcc
          title={title}
          titleBtnFooter={titleBtnFooter}
          user={employee}
          handleUpdateUser={handleUpdateEmployee}
          isEditInfor={isEditInfor}
          setIsEditInfor={setIsEditInfor}
          closeModal={closeModal}
        />
      )}
    </div>
  );
}
