import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import { IconClose } from "../icon";
import * as XLSX from "xlsx";
import toastMessage from "../../utils/toastMessage";

export default function UploadFileModal({ closeModal, handleUploadFile }) {
  const [isLoading, setIsLoading] = useState(true);
  const [fileName, setFileName] = useState("choose a file of excel");
  const [returnData, setReturnData] = useState([]);
  useEffect(() => {}, [fileName]);

  const onSubmit = async () => {
    if (returnData.length > 0) {
      try {
        await handleUploadFile(returnData);
        toastMessage({ type: "success", message: "Nhập danh sách từ file thành công." });
        closeModal();
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message;
        console.log(error);
        toastMessage({ type: "error", message: `Nhập danh sách từ file thất bại. ${errorMessage}.` });
      }
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    const validMimeTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel' // .xls
    ];
  
    if (!validMimeTypes.includes(file.type)) {
      toastMessage({ type: "error", message: "Vui lòng tải lên tệp Excel hợp lệ." });
      return;
    }
  
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    let jsonData = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
      defval: "",
    });
    
    jsonData.shift(); // Bỏ qua hàng đầu tiên nếu là tiêu đề
  
    // Lọc bỏ các hàng có dữ liệu rỗng hoặc ""
    jsonData = jsonData.filter(row => row.some(cell => cell !== null && cell !== ""));
    console.log(jsonData);
    setFileName(file.name);
    setReturnData(jsonData);
  };
  

  return (
    <React.Fragment>
      <div onClick={closeModal} className="bg-black/30 top-0 right-0 left-0 z-20 bottom-0 fixed w-full h-full"></div>

      <div
        className={`h-[40%] mt-[40px] px-[10px] rounded-[8px] z-20 fixed top-[45%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[50%] basis-[50%] min-w-[50%] bg-white`}
      >
        <div className="flex">
          <div className="justify-end absolute z-5 right-0 top-0">
            <div
              onClick={closeModal}
              className="flex items-center w-[50px] text-left rounded-bl-[8px] rounded-tr-[8px] bg-[#ee4d2d] text-[#fff] h-[40px] text-[25px] cursor-pointer hover:bg-[#e8340c]"
            >
              <IconClose />
            </div>
          </div>
        </div>

        <div className={`${styles.navbar} w-full h-full`}>
          <div className="h-[20%] flex justify-center items-center text-center text-primary text-[28px] font-[600] ">
            Nhập danh sách từ file Excel
          </div>
          <div className="h-[80%] flex justify-center items-center ">
            <div className="h-10 flex justify-center items-center border border-primary rounded-lg">
              <div className="w-[200px] p-1 flex justify-center items-center">
                <input onChange={(e) => handleUpload(e)} className="hidden" type="file" name="file" id="file" />
                <label className={`${returnData.length>0?"text-primary":"text-gray-400"}`} htmlFor="file">{fileName}</label>
              </div>
              <button
                className={` h-full inline-flex text-center leading-5 items-center justify-center 
                cursor-pointer  font-medium px-4 py-2 border-l border-primary text-sm rounded-r-lg
                text-white bg-primary ${returnData.length > 0 ? " hover:bg-red-800 cursor-pointer " : "cursor-not-allowed"} `}
                  onClick={onSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
