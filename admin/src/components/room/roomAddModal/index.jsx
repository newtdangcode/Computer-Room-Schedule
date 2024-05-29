import { useState, useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import Drawer from "../../modal/drawer";
import ModalHeader from "../../modal/header";
import ModalFooter from "../../modal/footer";
import { useForm } from "react-hook-form";
import yup from "../../../utils/yupGlobal";
import toastMessage from "../../../utils/toastMessage";
import styles from "./styles.module.css";
import employeeAPI from "../../../api/employeeAPI"

import RoomStatusApi from "../../../api/roomStatusAPI";
export default function AddModalRoom({ closeModal, title, titleBtnFooter, handleAddRoom }) {
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
    const [isLoading, setIsLoading] = useState(false);

  const schema = yup.object().shape({
    code: yup.string().required("Vui lòng nhập mã phòng."),
    name: yup.string().required("Vui lòng nhập tên phòng."),
    machine_quantity:yup.number().required("Vui lòng nhập số lượng máy."),
    employee_code:yup.string().required("Vui longf chọn người quản lý."),
    status_id:yup.number().required("Vui lòng chọn trạng thái phòng.")
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const onSubmit=async(data)=>{
    try {
        console.log(data);
        setIsLoading(true);
        await handleAddRoom(data);
        toastMessage({type:"success",message:"Thêm phòng thành công."});
        closeModal();
    } catch (error) {
        const errorMessage = error.response.data.message;
        console.log(error);
        toastMessage({ type: "error", message: `Thêm phòng thất bại. ${errorMessage}.` });
      } finally {
        setIsLoading(false);
      }
  };


{/* Trong phần JSX */}

  return (
    <div>
      <div onClick={closeModal} className={`bg-black/30 top-0 right-0 left-0 w-full h-full fixed `}></div>
      <Drawer closeModal={closeModal} title={title} titleBtnFooter={titleBtnFooter}>
        <ModalHeader closeModal={closeModal} title={title} />
        <div className="h-full overflow-y-scroll grow mt-[20px]">
          <form onSubmit={handleSubmit(onSubmit)}>
            
            <div className={`${styles.item}`}>
              <div className="w-1/3 text-sm text-gray-700 font-medium dark:text-gray-400">
                <label>Tên phòng</label>
              </div>
              <div className="flex flex-col w-2/3 ">
                <input
                  type="text"
                  placeholder="Nhập Tên Phòng"
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
                  placeholder="Nhập mã phòng"
                  className={`  ${
                    errors.code ? "border-red-500" : ""
                  } block w-full px-3 py-1 text-sm h-12 rounded-md bg-gray-100 focus:bg-gray-50 border-[1px] focus:bg-transparent focus:outline-none`}
                  {...register("code")}
                />
                {errors.code && <p className="text-red-500 text-sm">{`*${errors.code.message}`}</p>}
              </div>
            </div>
            <div className={`${styles.item}`}>
              <div className="w-1/3 text-sm text-gray-700 font-medium dark:text-gray-400">
                <label>Số lượng máy</label>
              </div>
              <div className="flex flex-col w-2/3 ">
                <input
                  type="text"
                  placeholder="Nhập số lượng máy"
                  className={`  ${
                    errors.code ? "border-red-500" : ""
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
                  
            <input type="submit" hidden id="send" />
          </form>
        </div>
        <ModalFooter title={titleBtnFooter} isLoading={isLoading} />
      </Drawer>
    </div>
  );
}

