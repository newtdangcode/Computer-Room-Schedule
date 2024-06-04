import Schedule from "../pages/schedule";
import Semester from "../pages/semester";
import Room from "../pages/room";
import Student from "../pages/student";
import Lecturer from "../pages/lecturer";
import Employee from "../pages/employee";
import Subject from "../pages/subject";
import Setting from "../pages/setting";
import Classes from "../pages/classes";
import Booking from "../pages/booking";
const adminRouter = [
  {
    path: "",
    element: Schedule,
  },
  {
    path: "/bookings",
    element: Booking,
  },
  {
    path: "/semesters",
    element: Semester,
  },
  {
    path: "/rooms",
    element: Room,
  },
  {
    path: "/subjects",
    element: Subject,
  },
  {
    path: "/classes",
    element: Classes,
  },
  {
    path: "/students",
    element: Student,
  },
  {
    path: "/lecturers",
    element: Lecturer,
  },
  {
    path: "/employees",
    element: Employee,
  },
  {
    path: "/setting",
    element: Setting,
  },
];

const employeeRouter = [
  {
    path: "",
    element: Schedule,
  },
  {
    path: "/bookings",
    element: Booking,
  },
  {
    path: "/semesters",
    element: Semester,
  },
  {
    path: "/rooms",
    element: Room,
  },
  {
    path: "/subjects",
    element: Subject,
  },
  {
    path: "/classes",
    element: Classes,
  },
  {
    path: "/students",
    element: Student,
  },
  {
    path: "/lecturers",
    element: Lecturer,
  },
  {
    path: "/setting",
    element: Setting,
  },
];
const lecturerRouter = [
  {
    path: "",
    element: Schedule,
  },
  {
    path: "/bookings",
    element: Booking,
  },
  {
    path: "/subjects",
    element: Subject,
  },
  {
    path: "/setting",
    element: Setting,
  },
];
const studentRouter = [
  {
    path: "",
    element: Schedule,
  },
  {
    path: "/setting",
    element: Setting,
  },
];

export { adminRouter, employeeRouter, lecturerRouter, studentRouter};
