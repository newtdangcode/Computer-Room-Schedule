import PageLayout from "../../components/layout/pageLayout";
import { useState } from "react";
import EditInfor from "../../components/employee/employeeEditModal/editInfor";
import EditAcc from "../../components/employee/employeeEditModal/editAcc";
import employeeAPI from "../../api/employeeAPI";
import { useDispatch, useSelector } from "react-redux";
import { setUserSuccess } from "../../features/auth/authSlice";
import authAPI from "../../api/authAPI";
import lecturerAPI from "../../api/lecturerAPI";
import studentAPI from "../../api/studentAPI";
export default function Setting() {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
 
  const user = auth.currentUser;
  const [isEditInfor, setIsEditInfor] = useState(true);
  const title = "Cập nhật thông tin tài khoản";
  const titleBtnFooter = "Cập nhật";
  const handleUpdateUser = async (code, data) => {
    if(user.account_id.role_id.id === 1 || user.account_id.role_id.id === 2){
      await employeeAPI.update(code, data);
    } else if(user.account_id.role_id.id === 3){
      await lecturerAPI.update(code, data);
    } else {
      await studentAPI.update(code, data);
    }
    
    const response = await authAPI.checkLogin();
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
          user={user}
          handleUpdateUser={handleUpdateUser}
          isEditInfor={isEditInfor}
          setIsEditInfor={setIsEditInfor}
          closeModal={closeModal}
          haveCloseModal={false}
        />
      ) : (
        <EditAcc
          title={title}
          titleBtnFooter={titleBtnFooter}
          user={user}
          handleUpdateUser={handleUpdateUser}
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