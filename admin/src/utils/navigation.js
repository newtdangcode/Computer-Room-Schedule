import {
  IconSchedule,
  IconRoom,
  IconLecturer,
  IconBook,
  IconSetting,
  IconEmployee,
  IconStudent,
  IconClock,
  IconList
} from "../components/icon";

const adminNavigation = [
  {
    title: "Thời Khoá biểu",
    path: "",
    icon: IconSchedule,
  },
  {
    title: "Đăng ký phòng",
    path: "/books",
    icon: IconBook,
  },
  {
    title: "Học kỳ",
    path: "/semesters",
    icon: IconClock,
  },
  {
    title: "Phòng máy",
    path: "/rooms",
    icon: IconRoom,
  },
  {
    title: "Môn học",
    path: "/subjects",
    icon: IconList,
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

const employeeNavigation = [
  {
    title: "Thời Khoá biểu",
    path: "",
    icon: IconSchedule,
  },
  {
    title: "Đăng ký phòng",
    path: "/books",
    icon: IconBook,
  },
  {
    title: "Học kỳ",
    path: "/semesters",
    icon: IconClock,
  },
  {
    title: "Phòng máy",
    path: "/rooms",
    icon: IconRoom,
  },
  {
    title: "Môn học",
    path: "/subjects",
    icon: IconList,
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
    title: "Cài đặt",
    path: "/setting",
    icon: IconSetting,
  },
];

export { adminNavigation, employeeNavigation };
