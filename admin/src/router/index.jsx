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
    path: "/books",
    element: Book,
  },
  {
    path: "/employees",
    element: Employee,
  },
];

const employeeRouter = [
  // {
  //   path: "",
  //   element: Dashboard,
  // },
  // {
  //   path: "/products",
  //   element: Product,
  // },
  // {
  //   path: "/category",
  //   element: Category,
  // },
  // {
  //   path: "/customers",
  //   element: Customer,
  // },
  // {
  //   path: "/customers/:id",
  //   element: CustomerOrder,
  // },
  // {
  //   path: "/orders",
  //   element: Order,
  // },
  // {
  //   path: "/setting",
  //   element: Setting,
  // },
  // {
  //   path: "/supplier",
  //   element: Supplier,
  // },
  // {
  //   path: "/import",
  //   element: Import,
  // },
  // {
  //   path: "/export",
  //   element: Export,
  // },
];

export { adminRouter, employeeRouter };
