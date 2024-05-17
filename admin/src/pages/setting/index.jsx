import PageLayout from "../../components/layout/pageLayout";
import { useState } from "react";
import EditInfor from "../../components/employee/employeeEditModal/editInfor";
import EditAcc from "../../components/employee/employeeEditModal/editAcc";
import employeeAPI from "../../api/employeeAPI";
import { useDispatch, useSelector } from "react-redux";
import { setUserSuccess } from "../../features/auth/authSlice";
import authAPI from "../../api/authAPI";
export default function Setting() {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const employee = auth.currentUser;
  const [isEditInfor, setIsEditInfor] = useState(true);
  const title = "Cập nhật thông tin tài khoản";
  const titleBtnFooter = "Cập nhật";
  const handleUpdateEmployee = async (code, data) => {
    await employeeAPI.update(code, data);
    const response = await authAPI.employeeCheckLogin();
    dispatch(setUserSuccess(response.data));
  }
  
  const closeModal = () => {
    
  };
  return (
  <PageLayout title="Cài đặt">
    <div className="bg-white rounded-lg ring-1 ring-gray-200 ring-opacity-4 overflow-hidden mb-5 shadow-xs">
        <div className="p-4">
        
      <div onClick={closeModal} ></div>
      {isEditInfor ? (
        <EditInfor
          title={title}
          titleBtnFooter={titleBtnFooter}
          employee={employee}
          handleUpdateEmployee={handleUpdateEmployee}
          isEditInfor={isEditInfor}
          setIsEditInfor={setIsEditInfor}
          closeModal={closeModal}
          haveCloseModal={false}
        />
      ) : (
        <EditAcc
          title={title}
          titleBtnFooter={titleBtnFooter}
          employee={employee}
          handleUpdateEmployee={handleUpdateEmployee}
          isEditInfor={isEditInfor}
          setIsEditInfor={setIsEditInfor}
          closeModal={closeModal}
          haveCloseModal={false}
        />
      )}
    </div>
       
    </div>
    </PageLayout>
  );
}