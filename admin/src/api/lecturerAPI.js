import axios from "axios";

const sampleLecturer=[
    {
    user_id: 1,
    first_name: "John",
    last_name: "Doe",
    email: "john@example.com",
    phone_number: "123456789",
    code:"S001",
    is_active: true,
    created_at: "2024-04-14T08:00:00Z",
    updated_at: "2024-04-14T08:00:00Z",
    },
    {
      user_id: 2,
      first_name: "Alice",
      last_name: "Smith",
      email: "alice@example.com",
      phone_number: "987654321",
      code: "S002",
      is_active: false,
      created_at: "2024-04-15T10:00:00Z",
      updated_at: "2024-04-15T10:00:00Z"
  },{
    user_id: 3,
    first_name: "Bob",
    last_name: "Johnson",
    email: "bob@example.com",
    phone_number: "555555555",
    code: "S003",
    is_active: true,
    created_at: "2024-04-16T12:00:00Z",
    updated_at: "2024-04-16T12:00:00Z"
},{
  user_id: 4,
  first_name: "Emily",
  last_name: "Davis",
  email: "emily@example.com",
  phone_number: "111222333",
  code: "S004",
  is_active: true,
  created_at: "2024-04-17T14:00:00Z",
  updated_at: "2024-04-17T14:00:00Z"
},{
  user_id: 5,
  first_name: "Michael",
  last_name: "Brown",
  email: "michael@example.com",
  phone_number: "999888777",
  code: "S005",
  is_active: true,
  created_at: "2024-04-18T16:00:00Z",
  updated_at: "2024-04-18T16:00:00Z"
},{
  user_id: 6,
  first_name: "Sophia",
  last_name: "Wilson",
  email: "sophia@example.com",
  phone_number: "444333222",
  code: "S006",
  is_active: true,
  created_at: "2024-04-19T18:00:00Z",
  updated_at: "2024-04-19T18:00:00Z"
}
];
var quantity=6;
const lecturerAPI={
    getAllLecturer:async(params)=>{
        
        let filteredLecturer=[...sampleLecturer];
        if(params.is_active!==undefined){
            filteredLecturer=filteredLecturer.filter((lecturer)=>lecturer.is_active===params.is_active);
        }
        if(params.search){
            const searchValue=params.search.toLowerCase().trim();
            filteredLecturer=filteredLecturer.filter(
                (lecturer)=>
                lecturer.first_name.toLowerCase().includes(searchValue)||
                lecturer.last_name.toLowerCase().includes(searchValue)||
                lecturer.code.toLowerCase().includes(searchValue)||
                lecturer.email.toLowerCase().includes(searchValue)
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
          filteredLecturer.sort((a, b) => {
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

        const totalLecturer =filteredLecturer.length;
        const totalPages=Math.ceil(totalLecturer/params.limit);
        const startIndex =(params.page-1)*params.limit;
        const endIndex=Math.min(startIndex+params.limit,totalLecturer);
        const currentPageData=filteredLecturer.slice(startIndex,endIndex);

        filteredLecturer =currentPageData.map((lecturer)=>({
          ...lecturer,
          
        }))
       const modifiedLecturer = filteredLecturer.map((lecturer)=>{
        if(lecturer.hasOwnProperty("user_id")){
            lecturer.id=lecturer.user_id;
            delete lecturer.user_id;
        }
        return lecturer;
       });
       console.log(modifiedLecturer);
        return {
            
            data:modifiedLecturer,
            currentPage:params.page,
            totalPages:totalPages,
        };

        
    },
    addLecturer:async(data)=>{
        const url ="/lecturer/register-lecturer";
        quantity++;
        const lecturer={
            user_id:quantity,
            first_name:data.first_name,
            last_name:data.last_name,
            email:data.email,
            phone_number:data.phone_number,
            code:data.code,
            is_active:true,
            created_at: "2024-04-14T08:00:00Z",
            updated_at: "2024-04-14T08:00:00Z",
        }
        console.log(lecturer);
        sampleLecturer.push(lecturer);
    },
    deleteLecturer :async(id)=>{
        const url=`/lecturers/${id}`;
        const updatedSampleLecturer=sampleLecturer.filter(lecturer=>lecturer.user_id!==id);
        sampleLecturer=updatedSampleLecturer;
        quantity--;
    },
    updateLecturerStatus: async (id, data) => {
      const url = `/lecturers/updateStatus/${id}`;
      const {is_active} = data;
      console.log(data,",",id);
      sampleLecturer.map((lecturer)=>{
        if(lecturer.user_id===id){
          lecturer.is_active=is_active;
        }
      });
      //await axios.patch(url, data);
    },
};
export default lecturerAPI;
