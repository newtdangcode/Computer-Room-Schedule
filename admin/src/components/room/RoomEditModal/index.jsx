import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import Drawer from "../../modal/drawer";
import ModalHeader from "../../modal/header";
import ModalFooter from "../../modal/footer";
import styles from "./styles.module.css";
import yup from "../../../utils/yupGlobal";
import toastMessage from "../../../utils/toastMessage";
import employeeAPI from "../../../api/employeeAPI"
import RoomStatusApi from "../../../api/roomStatusAPI";
export default function EditModalRoom({ haveCloseModal = true, closeModal, title, titleBtnFooter, handleUpdateRoom, editRoom }) {
  const [employees,setEmployees]=useState([]);
  const [roomStatus,setRoomStatus]=useState([]);
  useEffect(() => {
    getAllEmployee();
    getAllRoomStatus();
    }, []);
    const getAllEmployee=async()=>{
      try {
        const response=await employeeAPI.getAllWithoutParams();
        setEmployees(response.data);
      } catch (error) {
        console.log("Failed to fetch class list: ", error);
      }
    }
    const getAllRoomStatus= async()=>{
      try {
        const response=await RoomStatusApi.getAllWithoutParams();
        setRoomStatus(response.data);
      } catch (error) {
        console.log("Failed to fetch class list: ", error);
      }
    }
   
  const schema = yup.object().shape({
    name: yup.string().required("Vui lòng nhập tên lớp."),
    machine_quantity:yup.string().required("Vui Lòng Nhập số máy"),
    employee_code:yup.string().required("Chọn nhân viên")
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
      handleUpdateRoom(editRoom.code, data);
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
                  defaultValue={editRoom.name}
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
                <label>Số máy</label>
              </div>
              <div className="flex flex-col w-2/3">
                <input
                  defaultValue={editRoom.machine_quantity}
                  type="text"
                  placeholder="Nhập số máy"
                  className={`${
                    errors.name ? "border-red-500" : ""
                  } block w-full px-3 py-1 text-sm h-12 rounded-md bg-gray-100 focus:bg-gray-50 border-[1px] focus:bg-transparent focus:outline-none`}
                  {...register("machine_quantity")}
                />
                {errors.machine_quantity && <p className="text-red-500 text-sm">{`*${errors.machine_quantity.message}`}</p>}
              </div>
            </div>
            
            <div className={`${styles.item}`}>
              <div className="w-1/3 text-sm text-gray-700 font-medium dark:text-gray-400">
                <label>Nhân viên</label>
              </div>
              <div className="flex flex-col w-2/3 ">
                <select
                  defaultValue={""}
                  {...register("employee_code")}
                  className="block w-full px-3 py-1 text-sm h-12 rounded-md bg-gray-100 focus:bg-gray-50 border-[1px] focus:bg-transparent focus:outline-none"
                >
                    <option value="">Chọn Nhân viên</option>
                {employees.map((item) => (
                  <option value={item.code} key={item.code}>
                  {`${item.code} - ${item.first_name}`}
                  </option>
                ))}
                    
                </select>
                {errors.employee_code && <p className="text-red-500 text-sm">{`*${errors.employee_code.message}`}</p>}
              </div>
            </div>
            <div className={`${styles.item}`}>
              <div className="w-1/3 text-sm text-gray-700 font-medium dark:text-gray-400">
                <label>Trạng thái</label>
              </div>
              <div className="flex flex-col w-2/3 ">
                <select
                  defaultValue={""}
                  {...register("status_id")}
                  className="block w-full px-3 py-1 text-sm h-12 rounded-md bg-gray-100 focus:bg-gray-50 border-[1px] focus:bg-transparent focus:outline-none"
                >
                <option value="">Chọn Trạng thái</option>
        {roomStatus.map((item) => (
          <option value={item.id} key={item.id}>
        {item.name}
    </option>
           ))}
                    
                </select>
                {errors.status_id && <p className="text-red-500 text-sm">{`*${errors.status_id.message}`}</p>}
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
