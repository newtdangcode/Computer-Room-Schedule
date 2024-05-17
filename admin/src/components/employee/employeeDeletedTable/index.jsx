import React from "react";
import { Tooltip } from "react-tooltip";
import { IconRestore, IconDelete } from "../../icon";
import DataTable from "../../UserDataTable";
import jsUcfirst from "../../../utils/jsUcfirst";
import formatTimestamp from "../../../utils/formatTimestamp";
import Swal from "sweetalert2";

export default function EmployeeDeletedTable({
  employee,
  handleDelete,
  handleRestore,
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
}) {
  const columnData = [
    {
      field: "first_name",
      headerName: "Họ",
      renderCell: (item) => {
        return (
          <div className="flex gap-x-2 items-center">
            <p className="flex text-sm">{jsUcfirst(item.first_name)}</p>
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
      headerName: "Mã nhân viên",
      renderCell: (item) => {
        return <span className="text-sm">{item.code}</span>;
      },
    },
    {
      field: "phone",
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
      field: "role",
      headerName: "Chức vụ",
      renderCell: (item) => {
        return <span className="text-sm">{item.role === 1 ? "Quản lý" : "Nhân viên"}</span>;
      },
    },
    {
      field: "status",
      headerName: "Tình trạng",
      renderCell: (item) => {
        return (
          <div>
            {item.is_active === true ? (
              <span className="inline-flex px-2 text-xs font-medium leading-5 rounded-full text-black bg-slate-100">
                Còn làm
              </span>
            ) : (
              <span className="inline-flex px-2 text-xs font-medium leading-5 rounded-full text-red-500 bg-slate-100">
                Thôi làm
              </span>
            )}
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
                    handleRestore(item.code);
                    Swal.fire({
                      title: "Đã khôi phục",
                      text: "Nhân viên đã được khôi phục.",
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
            {/* <Tooltip id="edit" style={{ backgroundColor: "var(--color-primary" }} />
            <button
              onClick={() => {
                Swal.fire({
                  title: "Bạn chắc chắn muốn xoá?",
                  text: "Nhân viên sẽ được xoá và không thể khôi phục.",
                  icon: "question",
                  showCancelButton: true,
                  confirmButtonColor: "#0E9F6E",
                  cancelButtonColor: "#d33",
                  cancelButtonText: "Huỷ bỏ",
                  confirmButtonText: "Đồng ý!",
                }).then((result) => {
                  if (result.isConfirmed) {
                    handleDelete(item.code);
                    Swal.fire({ title: "Đã xoá", text: "Nhân viên đã được xoá.", confirmButtonColor: "#0E9F6E" });
                  }
                });
              }}
              data-tooltip-id="delete"
              data-tooltip-content="Xoá"
              className="hover:text-red-600"
            >
              <IconDelete />
            </button>
            <Tooltip id="delete" style={{ backgroundColor: "#EF4444" }} /> */}
          </div>
        );
      },
    },
  ];

  return (
    <DataTable
      columnData={columnData}
      rowData={employee}
      select
      isSelectAll={isSelectAll}
      isSelected={isSelected}
      handleSelected={handleSelected}
      handleSelectAll={handleSelectAll}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      nextPage={nextPage}
      prevPage={prevPage}
      totalPageCount={totalPageCount}
      limitPerPage={limitPerPage}
      setLimitPerPage={setLimitPerPage}
    />
  );
}
