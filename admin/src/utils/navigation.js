import {
  IconSchedule,
  IconRoom,
  IconLecturer,
  IconBook,
  IconSetting,
  IconEmployee,
  IconStudent,
  IconClock,
  IconList,
  IconClass
} from "../components/icon";

const adminNavigation = [
  {
    title: "Thời Khoá biểu",
    path: "",
    icon: IconSchedule,
  },
  {
    title: "Đăng ký phòng",
    path: "/bookings",
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
    title: "Lớp học",
    path: "/classes",
    icon: IconClass,
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
    path: "/bookings",
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
    title: "Lớp học",
    path: "/classes",
    icon: IconClass,
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

const lecturerNavigation = [
  {
    title: "Thời Khoá biểu",
    path: "",
    icon: IconSchedule,
  },
  {
    title: "Đăng ký phòng",
    path: "/bookings",
    icon: IconBook,
  },
  {
    title: "Môn học",
    path: "/subjects",
    icon: IconList,
  },
  {
    title: "Cài đặt",
    path: "/setting",
    icon: IconSetting,
  },
];

const studentNavigation = [
  {
    title: "Thời Khoá biểu",
    path: "",
    icon: IconSchedule,
  },
  {
    title: "Cài đặt",
    path: "/setting",
    icon: IconSetting,
  },
];

export { adminNavigation, employeeNavigation, lecturerNavigation, studentNavigation };
