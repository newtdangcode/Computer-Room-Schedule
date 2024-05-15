import axios from "axios";
const sampleEmployee=[
    {
        user_id: 1,
        code:"S001",
        account_id:"1",
        first_name: "John",
        last_name: "Doe",
        phone_number: "123456789",
        is_active:true,
        created_at: "2024-04-15T10:00:00Z",
        updated_at: "2024-04-15T10:00:00Z"
    },{
        user_id: 2,
        code: "S002",
        account_id: "2",
        first_name: "Alice",
        last_name: "Johnson",
        phone_number: "987654321",
        is_active: true,
        created_at: "2024-04-18T09:30:00Z",
        updated_at: "2024-04-18T09:30:00Z"
     },{
        user_id: 3,
        code: "S003",
        account_id: "3",
        first_name: "Emily",
        last_name: "Smith",
        phone_number: "555123456",
        is_active: false,
        created_at: "2024-04-20T14:45:00Z",
        updated_at: "2024-04-20T14:45:00Z"
     },{
        user_id: 4,
        code: "S004",
        account_id: "4",
        first_name: "Michael",
        last_name: "Brown",
        phone_number: "789987654",
        is_active: true,
        created_at: "2024-04-22T11:20:00Z",
        updated_at: "2024-04-22T11:20:00Z"
     },{
        user_id: 5,
        code: "S005",
        account_id: "5",
        first_name: "Sarah",
        last_name: "Williams",
        phone_number: "111222333",
        is_active: true,
        created_at: "2024-04-25T16:00:00Z",
        updated_at: "2024-04-25T16:00:00Z"
     }
]
const quantity=5;
const employeeAPI={
    getAllEmployee:async(params)=>{
        
        let filteredEmployee=[...sampleEmployee];
        if(params.is_active!==undefined){
            filteredEmployee=filteredEmployee.filter((employee)=>employee.is_active===params.is_active);
        }
        if(params.search){
            const searchValue=params.search.toLowerCase().trim();
            filteredEmployee=filteredEmployee.filter(
                (employee)=>
                employee.first_name.toLowerCase().includes(searchValue)||
                employee.last_name.toLowerCase().includes(searchValue)||
                employee.code.toLowerCase().includes(searchValue)
                
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
          filteredEmployee.sort((a, b) => {
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

        const totalEmployee =filteredEmployee.length;
        const totalPages=Math.ceil(totalEmployee/params.limit);
        const startIndex =(params.page-1)*params.limit;
        const endIndex=Math.min(startIndex+params.limit,totalEmployee);
        const currentPageData=filteredEmployee.slice(startIndex,endIndex);

        filteredEmployee =currentPageData.map((employee)=>({
          ...employee,
          
        }))
       const modifiedEmployee = filteredEmployee.map((employee)=>{
        if(employee.hasOwnProperty("user_id")){
            employee.id=employee.user_id;
            delete employee.user_id;
        }
        return employee;
       });
     
        return {
            
            data:modifiedEmployee,
            currentPage:params.page,
            totalPages:totalPages,
        };

        
    },
    updateEmployeeStatus: async (id, data) => {
      const url = `/employees/updateStatus/${id}`;
      const {is_active} = data;
     
      sampleEmployee.map((employee)=>{
        if(employee.user_id===id){
          employee.is_active=is_active;
        }
      });
      //await axios.patch(url, data);
    },
}
export default employeeAPI;