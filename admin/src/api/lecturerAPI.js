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
        first_name: "Tan",
        last_name: "Huynh",
        email: "john@example.com",
        phone_number: "123456789",
        code:"S001",
        is_active: true,
        created_at: "2024-04-14T08:00:00Z",
        updated_at: "2024-04-14T08:00:00Z",
    },
];
var quantity=2;
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
                lecturer.last_name_name.toLowerCase().includes(searchValue)||
                lecturer.code.toLowerCase().includes(searchValue)||
                lecturer.email.toLowerCase().includes(searchValue)
            )
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
    }
};
export default lecturerAPI;
