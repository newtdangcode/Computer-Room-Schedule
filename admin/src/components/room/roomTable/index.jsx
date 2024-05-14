import { Tooltip } from "react-tooltip";
import { IconEdit, IconDelete } from "../../icon";
import DataTable from "../../DataTable";
import formatTimestamp from "../../../utils/formatTimestamp";
import jsUcfirst from "../../../utils/jsUcfirst";
import Swal from "sweetalert2";
export default function RoomTable({
  room,
  handleSoftDelete,
  handleShowEditStaffModal,
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
      renderCell: (item) => {
        return  (
          <div className="flex justify-center items-center text-gray-400 gap-x-4">
            <button
              data-tooltip-id="edit"
              data-tooltip-content="Chỉnh sửa"
              className="hover:text-green-600"
              onClick={() => handleShowEditStaffModal(item)}
            >
              <IconEdit />
            </button>
            <Tooltip id="edit" style={{ backgroundColor: "var(--color-primary" }} />
            <button
              onClick={() => {
                Swal.fire({
                  title: "Bạn chắc chắn muốn xoá?",
                  text: "Phòng sẽ được chuyển vào thùng rác.",
                  icon: "question",
                  showCancelButton: true,
                  confirmButtonColor: "#0E9F6E",
                  cancelButtonColor: "#d33",
                  cancelButtonText: "Huỷ bỏ",
                  confirmButtonText: "Đồng ý!",
                }).then((result) => {
                  if (result.isConfirmed) {
                    handleSoftDelete(item._id);
                    Swal.fire({
                      title: "Đã chuyển vào thùng rác",
                      text: "Phòng đã được chuyển vào thùng rác.",
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
