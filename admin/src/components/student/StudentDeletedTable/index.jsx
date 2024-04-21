import React from "react";
import { Tooltip } from "react-tooltip";
import { IconRestore, IconDelete } from "../../icon";
import DataTable from "../../DataTable";
import jsUcfirst from "../../../utils/jsUcfirst";
import formatTimestamp from "../../../utils/formatTimestamp";
import Swal from "sweetalert2";

export default function StudentDeletedTable({
  students,
  handleDelete,
  handleRestore,
  isSelectAll,
  isSelected,
  handleSelectAll,
  handleSelected,
  currentPage,
  setCurrentPage,
  totalPageCount,
  limitPerPage,
  setLimitPerPage,
  currentUser,
}) {
  const columnData = [
    {
      field: "first_name",
      headerName: "Họ",
      renderCell: (item) => {
        return (
          <div className="flex gap-x-2 items-center">
  
            <p className="text-sm">{jsUcfirst(item.first_name)}</p>
            
          </div>
        );
      },
    },
    {
      field: "last_name",
      headerName: "Tên",
      renderCell: (item) => {
        return (
          <div className="flex gap-x-2 items-center">
  
            <p className="text-sm">{jsUcfirst(item.last_name)}</p>
            
          </div>
        );
      },
    },
    {
      field: "code",
      headerName: "Mã sinh viên",
      renderCell: (item) => {
        return <span className="text-sm">{item.code}</span>;
      },
    },
    {
      field: "class",
      headerName: "Lớp",
      renderCell: (item) => {
        return <span className="text-sm">{item.class_name}</span>;
      },
    },
    {
      field: "email",
      headerName: "Email",
      renderCell: (item) => {
        return <span className="text-sm">{item.email}</span>;
      },
    },
    {
      field: "phone_number",
      headerName: "Số điện thoại",
      renderCell: (item) => {
        return <span className="text-sm">{item.phone_number}</span>;
      },
    },
    {
      field: "joinDate",
      headerName: "Ngày tham gia",
      renderCell: (item) => {
        return <span className="text-sm">{formatTimestamp(item.created_at)}</span>;
      },
    },
    
    {
      field: "actions",
      headerName: "Thao tác",
      customClassName: "text-center",
      renderCell: (item) => {
        
        return(
          <div className="flex justify-center items-center text-gray-400 gap-x-4">
            <button
              onClick={() => {
                Swal.fire({
                  title: "Bạn chắc chắn muốn Khôi phục?",
                  icon: "question",
                  showCancelButton: true,
                  confirmButtonColor: "#0E9F6E",
                  cancelButtonColor: "#d33",
                  cancelButtonText: "Huỷ bỏ",
                  confirmButtonText: "Đồng ý!",
                }).then((result) => {
                  if (result.isConfirmed) {
                    handleRestore(item.id);
                    Swal.fire({
                      title: "Đã khôi phục",
                      text: "Sinh viên đã được khôi phục.",
                      confirmButtonColor: "#0E9F6E",
                    });
                  }
                });
              }}
              data-tooltip-id="restore"
              data-tooltip-content="Khôi phục"
              className="hover:text-primary"
            >
              <IconRestore />
            </button>
            <Tooltip id="edit" style={{ backgroundColor: "var(--color-primary" }} />
            <button
              onClick={() => {
                Swal.fire({
                  title: "Bạn chắc chắn muốn xoá?",
                  text: "Sinh viên sẽ được xoá và không thể khôi phục.",
                  icon: "question",
                  showCancelButton: true,
                  confirmButtonColor: "#0E9F6E",
                  cancelButtonColor: "#d33",
                  cancelButtonText: "Huỷ bỏ",
                  confirmButtonText: "Đồng ý!",
                }).then((result) => {
                  if (result.isConfirmed) {
                    handleDelete(item.id);
                    Swal.fire({ title: "Đã xoá", text: "Sinh viên đã được xoá.", confirmButtonColor: "#0E9F6E" });
                  }
                });
              }}
              data-tooltip-id="delete"
              data-tooltip-content="Xoá"
              className="hover:text-red-600"
            >
              <IconDelete />
            </button>
            <Tooltip id="delete" style={{ backgroundColor: "#EF4444" }} />
          </div>
        );
      },
    },
    
  ];
  


  return (
    <DataTable
      columnData={columnData}
      rowData={students}
      select
      isSelectAll={isSelectAll}
      isSelected={isSelected}
      handleSelected={handleSelected}
      handleSelectAll={handleSelectAll}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      totalPageCount={totalPageCount}
      limitPerPage={limitPerPage}
      setLimitPerPage={setLimitPerPage}
    />
  );
}