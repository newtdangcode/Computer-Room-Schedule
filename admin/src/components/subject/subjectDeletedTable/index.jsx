import { Tooltip } from "react-tooltip";
import { IconRestore, IconEye, IconView } from "../../icon";
import DataTableUseId from "../../DataTableUseId";
import formatTimestamp from "../../../utils/formatTimestamp";
import jsUcfirst from "../../../utils/jsUcfirst";
import Swal from "sweetalert2";
export default function SubjectDeletedTable({
  subjects,
  handleDelete,
  handleRestore,
  handleShowStudentList,
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
      headerName: "Tên học môn học",
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
      headerName: "Mã môn học",
      renderCell: (item) => {
        return (
          <div className="flex gap-x-2 items-center">
            <p className="text-sm">{item.code}</p>
          </div>
        );
      },
    },
    {
      field: "lecturer_code",
      headerName: "Giảng viên",
      renderCell: (item) => {
        return (
          <div className="flex gap-x-2 items-center">
            <p className="text-sm">{jsUcfirst(item.lecturer_code.first_name)} {jsUcfirst(item.lecturer_code.last_name)}</p>
          </div>
        );
      },
    },
    {
      field: "semester_id",
      headerName: "Học kỳ",
      renderCell: (item) => {
        return (
          <div className="flex gap-x-2 items-center">
            <p className="text-sm">{jsUcfirst(item.semester_id.name)}</p>
          </div>
        );
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
      field: "status",
      headerName: "Tình trạng",
      renderCell: (item) => {
        return (
          <div>
            {item.is_active === true ? (
              <span className="inline-flex px-2 text-xs font-medium leading-5 rounded-full text-black bg-slate-100">
                Còn hoạt động
              </span>
            ) : (
              <span className="inline-flex px-2 text-xs font-medium leading-5 rounded-full text-red-500 bg-slate-100">
                Ngưng hoạt động
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
              data-tooltip-id="view"
              data-tooltip-content="Xem danh sách sinh viên"
              className="hover:text-primary"
              onClick={() => handleShowStudentList(item.code)}
            >
              <IconView />
            </button>
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
                      text: "Học môn học đã được khôi phục.",
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
                  text: "Học môn học sẽ được xoá và không thể khôi phục.",
                  icon: "question",
                  showCancelButton: true,
                  confirmButtonColor: "#0E9F6E",
                  cancelButtonColor: "#d33",
                  cancelButtonText: "Huỷ bỏ",
                  confirmButtonText: "Đồng ý!",
                }).then((result) => {
                  if (result.isConfirmed) {
                    handleDelete(item.code);
                    Swal.fire({ title: "Đã xoá", text: "Học môn học đã được xoá.", confirmButtonColor: "#0E9F6E" });
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
    <DataTableUseId
      columnData={columnData}
      rowData={subjects}
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
