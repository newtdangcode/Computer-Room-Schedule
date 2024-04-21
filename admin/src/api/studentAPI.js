import axios from "./axios";
import classAPI from "./classAPI";
import { USER_ROLES } from "../utils/Constant";
var sampleStudents = [
  {
    user_id: 1,
    first_name: "John",
    last_name: "Doe",
    code: "S001",
    class_id: 1,
    email: "john@example.com",
    phone_number: "123456789",
    is_active: true,
    created_at: "2024-04-14T08:00:00Z",
    updated_at: "2024-04-14T08:00:00Z",
  },
  {
    user_id: 2,
    first_name: "Alice",
    last_name: "Smith",
    code: "S002",
    class_id: 1,
    email: "alice@example.com",
    phone_number: "987654321",
    is_active: true,
    created_at: "2024-04-14T08:00:00Z",
    updated_at: "2024-04-14T08:00:00Z",
  },
  {
    user_id: 3,
    first_name: "Bob",
    last_name: "Johnson",
    code: "S003",
    class_id: 2,
    email: "bob@example.com",
    phone_number: "555555555",
    is_active: true,
    created_at: "2024-04-14T08:00:00Z",
    updated_at: "2024-04-14T08:00:00Z",
  },
  {
    user_id: 4,
    first_name: "Emily",
    last_name: "Brown",
    code: "S004",
    class_id: 2,
    email: "emily@example.com",
    phone_number: "111111111",
    is_active: true,
    created_at: "2024-04-14T08:00:00Z",
    updated_at: "2024-04-14T08:00:00Z",
  },
  {
    user_id: 5,
    first_name: "Michael",
    last_name: "Williams",
    code: "S005",
    class_id: 3,
    email: "michael@example.com",
    phone_number: "999999999",
    is_active: false,
    created_at: "2024-04-14T08:00:00Z",
    updated_at: "2024-04-14T08:00:00Z",
  },
  {
    user_id: 6,
    first_name: "Emma",
    last_name: "Taylor",
    code: "S006",
    class_id: 3,
    email: "emma@example.com",
    phone_number: "777777777",
    is_active: true,
    created_at: "2024-04-14T08:00:00Z",
    updated_at: "2024-04-14T08:00:00Z",
  },
  {
    user_id: 7,
    first_name: "James",
    last_name: "Wilson",
    code: "S007",
    class_id: 1,
    email: "james@example.com",
    phone_number: "888888888",
    is_active: true,
    created_at: "2024-04-14T08:00:00Z",
    updated_at: "2024-04-14T08:00:00Z",
  },
  {
    user_id: 8,
    first_name: "Olivia",
    last_name: "Martinez",
    code: "S008",
    class_id: 2,
    email: "olivia@example.com",
    phone_number: "666666666",
    is_active: false,
    created_at: "2024-04-14T08:00:00Z",
    updated_at: "2024-04-14T08:00:00Z",
  },
  {
    user_id: 9,
    first_name: "William",
    last_name: "Jones",
    code: "S009",
    class_id: 3,
    email: "william@example.com",
    phone_number: "333333333",
    is_active: true,
    created_at: "2024-04-14T08:00:00Z",
    updated_at: "2024-04-14T08:00:00Z",
  },
  {
    user_id: 10,
    first_name: "Sophia",
    last_name: "Lee",
    code: "S010",
    class_id: 2,
    email: "sophia@example.com",
    phone_number: "444444444",
    is_active: true,
    created_at: "2024-04-14T08:00:00Z",
    updated_at: "2024-04-14T08:00:00Z",
  },
  {
    user_id: 11,
    first_name: "Alexander",
    last_name: "Garcia",
    code: "S011",
    class_id: 1,
    email: "alexander@example.com",
    phone_number: "222222222",
    is_active: true,
    created_at: "2024-04-14T08:00:00Z",
    updated_at: "2024-04-14T08:00:00Z",
  },
  {
    user_id: 12,
    first_name: "Isabella",
    last_name: "Rodriguez",
    code: "S012",
    class_id: 3,
    email: "isabella@example.com",
    phone_number: "555555555",
    is_active: true,
    created_at: "2024-04-14T08:00:00Z",
    updated_at: "2024-04-14T08:00:00Z",
  },
  {
    user_id: 13,
    first_name: "Daniel",
    last_name: "Hernandez",
    code: "S013",
    class_id: 1,
    email: "daniel@example.com",
    phone_number: "999999999",
    is_active: true,
    created_at: "2024-04-14T08:00:00Z",
    updated_at: "2024-04-14T08:00:00Z",
  },
];
var quantity= 13;

const studentAPI = {
  getAllStudent: async (params) => {
    let filteredStudents = [...sampleStudents];

    // Filtering logic
    if (params.class_id) {
      filteredStudents = filteredStudents.filter((student) => student.class_id == params.class_id);
    }
    if (params.is_active !== undefined) {
      filteredStudents = filteredStudents.filter((student) => student.is_active === params.is_active);
    }
    if (params.search) {
      const searchValue = params.search.toLowerCase().trim();
      filteredStudents = filteredStudents.filter(
        (student) =>
          student.first_name.toLowerCase().includes(searchValue) ||
          student.last_name.toLowerCase().includes(searchValue) ||
          student.code.toLowerCase().includes(searchValue) ||
          student.email.toLowerCase().includes(searchValue),
      );
    }

    // Sorting logic
    if (params.sort) {
      let sortBy;
      let sortOrder = 1; // Default sortOrder

      // Kiểm tra nếu params.sort là một string, sử dụng nó trực tiếp
      if (typeof params.sort === "string") {
        sortBy = params.sort;
      } else {
        // Nếu params.sort là một object, lấy trường và hướng sắp xếp
        sortBy = Object.keys(params.sort)[0];
        sortOrder = params.sort[sortBy] === "asc" ? 1 : -1;
      }
      // Xác định trường và hướng sắp xếp tương ứng
      let fieldToSort;
      switch (sortBy) {
        case "last_name":
          fieldToSort = "last_name";
          break;
        case "-last_name":
          fieldToSort = "last_name";
          sortOrder = -1; // Đảo hướng sắp xếp
          break;
        case "created_at":
          fieldToSort = "created_at";
          break;
        case "-created_at":
          fieldToSort = "created_at";
          sortOrder = -1; // Đảo hướng sắp xếp
          break;
        default:
          // Trường hợp không hợp lệ, không thực hiện sắp xếp
          break;
      }

      // Nếu trường sắp xếp được xác định, thực hiện sắp xếp
      if (fieldToSort) {
        filteredStudents.sort((a, b) => {
          if (typeof a[fieldToSort] === "string") {
            return a[fieldToSort].localeCompare(b[fieldToSort]) * sortOrder;
          } else if (typeof a[fieldToSort] === "number") {
            return (a[fieldToSort] - b[fieldToSort]) * sortOrder;
          } else {
            return 0;
          }
        });
      }
    }

    // Pagination logic
    const totalStudents = filteredStudents.length;
    const totalPages = Math.ceil(totalStudents / params.limit);
    const startIndex = (params.page - 1) * params.limit;
    const endIndex = Math.min(startIndex + params.limit, totalStudents);
    const currentPageData = filteredStudents.slice(startIndex, endIndex);

    // Get classes data
    const classResponse = await classAPI.getAllClass();
    const classMap = {};
    classResponse.data.forEach((cls) => {
      classMap[cls.id] = cls.name;
    });

    // Map class_name to each student
    filteredStudents = currentPageData.map((student) => ({
      ...student,
      class_name: classMap[student.class_id],
    }));
    const modifiedStudents = filteredStudents.map((student) => {
      if (student.hasOwnProperty("user_id")) {
        student.id = student.user_id;
        delete student.user_id;
      }
      return student;
    });
    // Return data
    return {
      data: modifiedStudents,
      currentPage: params.page,
      totalPages: totalPages,
      // Other return data (if any)
    };
  },
  //   getAllStudent: async (params) => {
  //     const url = "/students";
  //     const response = await axios.get(url, { params });
  //     return response;
  //   },
    addStudent: async (data) => {
      const url = "/students/register-student";
      quantity++;
      const student = {
        user_id : quantity,
        first_name : data.first_name,
        last_name : data.last_name,
        code : data.code,
        class_id : parseInt(data.class_id, 10),
        email : data.email,
        phone_number : data.phone_number,
        is_active: true,
        created_at: "2024-04-14T08:00:00Z",
        updated_at: "2024-04-14T08:00:00Z",
        //username : data.username,
        //password : data.password,
        //role_id : parseInt(data.role_id, 10)
      }
      console.log(student);
      sampleStudents.push(student);
      
      //await axios.post(url, data);
    },
    updateStudent: async (id, data) => {
      const url = `/students/${id}`;
      const {
        first_name,
        last_name,
        code,
        class_id,
        email,
        phone_number,
        role_id
      } = data;
      sampleStudents.map((student)=>{
        if(student.id===id){
          if(first_name){
            student.first_name=first_name;
          }
          if(last_name){
            student.last_name=last_name;
          }
          if(code){
            student.code=code;
          }
          if(class_id){
            student.class_id=class_id;
          }
          if(email){
            student.email=email;
          }
          if(phone_number){
            student.phone_number=phone_number;
          }
          if(role_id){
            student.role_id=role_id;
          }
        }
      });
      //await axios.patch(url, data);
    },
    updateStudentStatus: async (id, data) => {
      const url = `/students/updateStatus/${id}`;
      const {is_active} = data;
      console.log(data,",",id);
      sampleStudents.map((student)=>{
        if(student.user_id===id){
          student.is_active=is_active;
        }
      });
      //await axios.patch(url, data);
    },
    updateManyStudentStatus: async (data) => {
      const url = "/students/updateStatus";
      
      //await axios.patch(url, { data});
    },
    deleteStudent: async (id) => {
      const url = `/students/${id}`;
      const updatedSampleStudents = sampleStudents.filter(student => student.user_id !== id);
      sampleStudents = updatedSampleStudents;
      quantity--;
      //await axios.delete(url);
    },
    deleteManyStudent: async (data) => {
      const url = "/students";
      console.log(data);
      //await axios.delete(url, {data});
    },
};
export default studentAPI;
