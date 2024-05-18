import Schedule from "../pages/schedule";
import Semester from "../pages/semester";
import Room from "../pages/room";
import Book from "../pages/book";
import Student from "../pages/student";
import Lecturer from "../pages/lecturer";
import Employee from "../pages/employee";
import Subject from "../pages/subject";
import Setting from "../pages/setting";
import Class from "../pages/class";
const adminRouter = [
  {
    path: "",
    element: Schedule,
  },
  {
    path: "/books",
    element: Book,
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
    path: "/class",
    element: Class,
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
    path: "/books",
    element: Book,
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
    path: "/class",
    element: Class,
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
];

export { adminRouter, employeeRouter };
