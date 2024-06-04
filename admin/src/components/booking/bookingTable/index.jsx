import { Tooltip } from "react-tooltip";
import { IconEdit, IconDelete } from "../../icon";
import DataTableUseId from "../../DataTableUseId";
import formatDate from "../../../utils/formatDate";
import jsUcfirst from "../../../utils/jsUcfirst";
import Swal from "sweetalert2";
import formatTimestamp from "../../../utils/formatTimestamp";
import { useEffect } from "react";
export default function BookingTable({
  bookings,
  handleSoftDelete,
  handleShowEditModal,
  isSelectAll,
  isSelected,
  handleSelectAll,
  handleSelected,
  currentPage,
  setCurrentPage,
  nextPage,
  prevPage,
  totalPageCount,
  limitPerPage,
  setLimitPerPage,
  currentUser,
  handleUpdateStatus
}) {
  
  const columnData = [
    {
      field: "room",
      headerName: "Phòng",
      renderCell: (item) => {
        return (
          <div className="flex gap-x-2 items-center">
            <p className="text-sm">{jsUcfirst(item.room_code.code)}</p>
          </div>
        );
      },
    },
    {
      field: "date",
      headerName: "Ngày",
      renderCell: (item) => {
        return <span className="text-sm">{formatDate(item.date)}</span>;
      },
    },
    {
      field: "shift",
      headerName: "Ca",
      renderCell: (item) => {
        return <span className="text-sm">{item.shift_id.name}</span>;
      },
    },
    {
      field: "lecturer",
      headerName: "Giảng viên",
      renderCell: (item) => {
        return <span className="text-sm">{item.lecturer_code.first_name} {item.lecturer_code.last_name}</span>;
      },
    },
    {
      field: "subject",
      headerName: "Môn học",
      renderCell: (item) => {
        return <span className="text-sm">{item.subject_id.name}</span>;
      },
    },
    {
      field: "created_at",
      headerName: "Ngày Tạo",
      renderCell: (item) => {
        return <span className="text-sm">{formatTimestamp(item.created_at)}</span>;
      },
    },
    {
      field: "status",
      headerName: "Trạng thái",
      renderCell: (item) => {
        switch (item.status_id.id) {
          case 1:
            return <span className="rounded-full px-1 text-sm border-[1px] border-gray-400 bg-white text-gray-400">{item.status_id.name}</span>;
          case 2:
            return <span className="rounded-full px-1 text-sm border-[1px] border-primary bg-white text-primary">{item.status_id.name}</span>;
          case 3:
            return <span className="rounded-full px-1 text-sm bg-gray-400 text-white">{item.status_id.name}</span>;
          case 4:
            return <span className="rounded-full px-1 text-sm bg-red-800 text-white">{item.status_id.name}</span>;
        }
        
      },
    },
    {
      field: "updated_status",
      headerName: "Cập nhật trạng thái",
      renderCell: (item) => {
        if (item.status_id.id === 1) {
          return (
            <div className="flex">
              <button
                className="py-1 px-2 bg-white text-primary border-[1px] border-primary rounded-full text-xs hover:bg-red-500 hover:text-white font-semibold"
                onClick={() => {
                  handleUpdateStatus(item.id, 2);
                }}
              >
                Xác nhận
              </button>
              <button
                className="ml-1 py-1 px-2 bg-primary text-white rounded-full text-xs hover:bg-red-800 font-semibold"
                onClick={() => {
                  handleUpdateStatus(item.id, 4);
                }}
              >
                Từ chối
              </button>
            </div>
          );
        }else{
          return(
            <div className="flex h-8 w-[50px]">
              <div className="flex py-1 px-2 text-center items-center bg-white text-gray-400 rounded-full text-xs font-semibold">
                không thể cập nhật
              </div>
          </div>
          );
          
        }
        
      },
    },

    
  ];
  if(currentUser.account_id.role_id.id === 3){
    columnData.pop();
    columnData.push(
      {
        field: "updated_status",
        headerName: "Huỷ đăng ký",
        renderCell: (item) => {
          if (item.status_id.id === 1) {
            return (
              <div className="flex">
                
                <button
                  className="ml-1 py-1 px-2 bg-primary text-white rounded-full text-xs hover:bg-red-800 font-semibold"
                  onClick={() => {
                    handleUpdateStatus(item.id, 3);
                  }}
                >
                  Huỷ
                </button>
              </div>
            );
          }else{
            return(
              <div className="flex h-8 w-[50px]">
                <div className="flex py-1 px-2 text-center items-center bg-white text-gray-400 rounded-full text-xs font-semibold">
                  không thể huỷ
                </div>
            </div>
            );
            
          }
          
        },
      },
    );
  }

  return (
    <DataTableUseId
      columnData={columnData}
      rowData={bookings}
      select
      isSelectAll={isSelectAll}
      isSelected={isSelected}
      handleSelected={handleSelected}
      handleSelectAll={handleSelectAll}
      currentPage={currentPage}
      nextPage={nextPage}
      prevPage={prevPage}
      currentUser={currentUser}
      setCurrentPage={setCurrentPage}
      totalPageCount={totalPageCount}
      limitPerPage={limitPerPage}
      setLimitPerPage={setLimitPerPage}
    />
  );
}
