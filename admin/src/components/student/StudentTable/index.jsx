import React from "react";
import { Tooltip } from "react-tooltip";
import { IconEdit, IconDelete } from "../../icon";
import DataTableUseCode from "../../DataTableUseCode";
import formatTimestamp from "../../../utils/formatTimestamp";
import jsUcfirst from "../../../utils/jsUcfirst";
import Swal from "sweetalert2";

export default function StudentTable({
  isSubjectStudentList=false,
  handleDeleteFromSubjectStudentList,
  haveActions=true,
  students,
  handleSoftDelete,
  handleShowEditModal,
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
        return <span className="text-sm">{item.class_code.code}</span>;
      },
    },
    {
      field: "email",
      headerName: "Email",
      renderCell: (item) => {
        return <span className="text-sm">{item.account_id.email}</span>;
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
      renderCell: (item) => {
        return (
          <div className="flex justify-center items-center text-gray-400 gap-x-4">
            <button
              data-tooltip-id="edit"
              data-tooltip-content="Chỉnh sửa"
              className="hover:text-primary"
              onClick={() => handleShowEditModal(item.code)}
            >
              <IconEdit />
            </button>
            <Tooltip id="edit" style={{ backgroundColor: "var(--color-primary" }} />
            <button
              onClick={() => {
                Swal.fire({
                  title: "Bạn chắc chắn muốn xoá?",
                  text: "Sinh viên sẽ được chuyển vào thùng rác.",
                  icon: "question",
                  showCancelButton: true,
                  confirmButtonColor: "#0E9F6E",
                  cancelButtonColor: "#d33",
                  cancelButtonText: "Huỷ bỏ",
                  confirmButtonText: "Đồng ý!",
                }).then((result) => {
                  if (result.isConfirmed) {
                    handleSoftDelete(item.code);
                    Swal.fire({
                      title: "Đã chuyển vào thùng rác",
                      text: "Sinh viên đã được chuyển vào thùng rác.",
                      confirmButtonColor: "#0E9F6E",
                    });
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
  if(!haveActions||isSubjectStudentList){
    columnData.pop();
    columnData.pop();
    if(isSubjectStudentList){
      columnData.push(
        {
          field: "actions",
          headerName: "Thao tác",
          renderCell: (item) => {
            return (
              <div className="flex justify-center items-center text-gray-400 gap-x-4">
                
                <button
                  onClick={() => {
                    Swal.fire({
                      title: "Bạn chắc chắn muốn xoá?",
                      text: "Sinh viên sẽ được xoá khỏi lớp.",
                      icon: "question",
                      showCancelButton: true,
                      confirmButtonColor: "#0E9F6E",
                      cancelButtonColor: "#d33",
                      cancelButtonText: "Huỷ bỏ",
                      confirmButtonText: "Đồng ý!",
                    }).then((result) => {
                      if (result.isConfirmed) {
                        handleDeleteFromSubjectStudentList(item.code);
                        Swal.fire({
                          title: "Đã được xoá khỏi lớp",
                          text: "Sinh viên đã được được xoá khỏi lớp.",
                          confirmButtonColor: "#0E9F6E",
                        });
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
      )
    }
    
  }
  return (
    <DataTableUseCode
      isSubjectStudentList={isSubjectStudentList}
      columnData={columnData}
      rowData={students}
      select={haveActions}
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
