import Schedule from "../pages/schedule";
import Room from "../pages/room";
import Book from "../pages/book";
import Student from "../pages/student";
import Lecturer from "../pages/lecturer";
import Employee from "../pages/employee";

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
    path: "/rooms",
    element: Room,
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
    path: "/rooms",
    element: Room,
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
