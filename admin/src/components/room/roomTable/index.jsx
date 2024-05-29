import { Tooltip } from "react-tooltip";
import { IconEdit, IconDelete } from "../../icon";
import DataTableUseCode from "../../DataTableUseCode";
import formatTimestamp from "../../../utils/formatTimestamp";
import jsUcfirst from "../../../utils/jsUcfirst";
import Swal from "sweetalert2";
export default function RoomTable({
  rooms,
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
}) {
  const columnData = [
    {
      field: "name",
      headerName: "Tên",
      renderCell: (item) => {
        return (
          <div className="flex gap-x-2 items-center">
            <p className="text-sm">{jsUcfirst(item.name)}</p>
          </div>
        );
      },
    },
    {
      field: "code",
      headerName: "Mã Phòng",
      renderCell: (item) => {
        return <span className="text-sm">{item.code}</span>;
      },
    },
    {
      field: "machine_quantity",
      headerName: "Số lượng máy",
      renderCell: (item) => {
        return <span className="text-sm">{(item.machine_quantity)}</span>;
      },
    },
    {
      field: "created_at",
      headerName: "Ngày tạo",
      renderCell: (item) => {
        return <span className="text-sm">{formatTimestamp(item.created_at)}</span>;
      },
      
    },
   

    {
      field: "status_id",
      headerName: "Trạng thái",
      renderCell: (item) => {
        const statusName = item.status_id.name;
        let styleClasses;
    
        if (statusName === 'Đang bảo trì') {
          styleClasses = 'text-black bg-yellow-100';
        } else if (statusName === 'Đang hoạt động') {
          styleClasses = 'text-white bg-green-500';
        } else {
          styleClasses = 'text-white bg-gray-500';
        }
    
        return (
          <span
            className={`inline-flex px-2 text-xs font-medium leading-5 rounded-full ${styleClasses}`}
          >
            {statusName}
          </span>
        );
      },
    }
,    
    
    
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
                  text: "Lớp sẽ được chuyển vào thùng rác.",
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
                      text: "Lớp đã được chuyển vào thùng rác.",
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
    <DataTableUseCode
      columnData={columnData}
      rowData={rooms}
      select
      isSelectAll={isSelectAll}
      isSelected={isSelected}
      handleSelected={handleSelected}
      handleSelectAll={handleSelectAll}
      currentPage={currentPage}
      nextPage={nextPage}
      prevPage={prevPage}
      setCurrentPage={setCurrentPage}
      totalPageCount={totalPageCount}
      limitPerPage={limitPerPage}
      setLimitPerPage={setLimitPerPage}
    />
  );
}
