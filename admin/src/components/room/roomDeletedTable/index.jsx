import React from "react";
import { Tooltip } from "react-tooltip";
import { IconRestore, IconDelete } from "../../icon";
import DataTable from "../../UserDataTable";
import jsUcfirst from "../../../utils/jsUcfirst";
import formatTimestamp from "../../../utils/formatTimestamp";
import Swal from "sweetalert2";
export default function RoomDeletedTable({
  room,
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
      field: "name",
      headerName: "Tên phòng",
      renderCell: (item) => {
        return (
          <div className="flex gap-x-2 items-center">
            <p className="text-sm">{jsUcfirst(item.name)}</p>
          </div>
        );
      },
    },
    {
      field: "machine_quantity",
      headerName: "Số lượng máy",
      renderCell: (item) => {
        return <span className="text-sm">{item.machine_quantity}</span>;
      },
    },
    {
      field: "employee",
      headerName: "Phụ trách",
      renderCell: (item) => {
        return <span className="text-sm">{item.employee_code}</span>;
      },
    },
    {
      field: "joinDate",
      headerName: "Ngày thêm vào",
      renderCell: (item) => {
        return <span className="text-sm">{formatTimestamp(item.created_at)}</span>;
      },
    },

    {
      field: "status",
      headerName: "Tình trạng",
      renderCell: (item) => {
        return (
          <div>
            <span className="inline-flex px-2 text-xs font-medium leading-5 rounded-full text-green-500 bg-green-100">
              {item.status}
            </span>
          </div>
        );
      },
    },
    {
      field: "actions",
      headerName: "Thao tác",
      customClassName: "text-center",
      renderCell: (item) => {
        return (
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
                    handleRestore(item._id);
                    Swal.fire({
                      title: "Đã khôi phục",
                      text: "Phòng đã được khôi phục.",
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
                  text: "Phòng sẽ được xoá và không thể khôi phục.",
                  icon: "question",
                  showCancelButton: true,
                  confirmButtonColor: "#0E9F6E",
                  cancelButtonColor: "#d33",
                  cancelButtonText: "Huỷ bỏ",
                  confirmButtonText: "Đồng ý!",
                }).then((result) => {
                  if (result.isConfirmed) {
                    handleDelete(item._id);
                    Swal.fire({ title: "Đã xoá", text: "Phòng đã được xoá.", confirmButtonColor: "#0E9F6E" });
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
      rowData={room}
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
