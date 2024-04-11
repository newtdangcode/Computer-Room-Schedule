import {
  IconSchedule,
  IconRoom,
  IconLecturer,
  IconBook,
  IconSetting,
  IconEmployee,
  IconStudent,
} from "../components/icon";

const adminNavigation = [
  {
    title: "Thời Khoá biểu",
    path: "",
    icon: IconSchedule,
  },
  {
    title: "Phòng máy",
    path: "/rooms",
    icon: IconRoom,
  },
  {
    title: "Đăng ký phòng",
    path: "/books",
    icon: IconBook,
  },
  {
    title: "Sinh viên",
    path: "/students",
    icon: IconStudent,
  },
  {
    title: "Giảng viên",
    path: "/lecturers",
    icon: IconLecturer,
  },
  {
    title: "Nhân viên",
    path: "/employees",
    icon: IconEmployee,
  },
  {
    title: "Cài đặt",
    path: "/setting",
    icon: IconSetting,
  },
];

const staffNavigation = [
  {
    title: "Thời Khoá biểu",
    path: "",
    icon: IconSchedule,
  },
  {
    title: "Phòng máy",
    path: "/rooms",
    icon: IconRoom,
  },
  {
    title: "Đơn đặt phòng",
    path: "/books",
    icon: IconBook,
  },
  {
    title: "Sinh viên",
    path: "/students",
    icon: IconStudent,
  },
  {
    title: "Giảng viên",
    path: "/lecturers",
    icon: IconLecturer,
  },
  {
    title: "Nhân viên",
    path: "/employees",
    icon: IconEmployee,
  },
  {
    title: "Cài đặt",
    path: "/setting",
    icon: IconSetting,
  },
];

export { adminNavigation, staffNavigation };
