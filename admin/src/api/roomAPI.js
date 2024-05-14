import axios from "axios";

const sampleroom = [
   
    {
        id: 1,
        name: "2B01",
        machine_quantity: 15,
        employee_code: "S02",
        status: "Đang hoạt động",
        is_active: false,
        created_at: "2024-03-10T10:30:00Z",
        updated_at: "2024-04-25T09:45:00Z"
   },{
    id: 2,
    name: "2B11",
    machine_quantity: 30,
    employee_code: "S03",
    status: "Đang hoạt động",
    is_active: true,
    created_at: "2024-01-05T08:15:00Z",
    updated_at: "2024-02-20T11:20:00Z"
},{
    id: 3,
    name: "2B21",
    machine_quantity: 25,
    employee_code: "S04",
    status: "Đang hoạt động",
    is_active: true,
    created_at: "2024-02-28T16:40:00Z",
    updated_at: "2024-04-30T13:55:00Z"
}, {
    id: 4,
    name: "2B31",
    machine_quantity: 25,
    employee_code: "S04",
    status: "Đang bảo trì",
    is_active: true,
    created_at: "2024-02-28T16:40:00Z",
    updated_at: "2024-04-30T13:55:00Z"
}
];
var quantity=4

const roomAPI = {
  getAllRoom :async(params)=>{
    let filteredRoom=[...sampleroom];
    if(params.is_active!==undefined){
        filteredRoom=filteredRoom.filter((room)=>room.is_active===params.is_active)
    }
    if(params.search){
        const searchValue=params.search.toLowerCase().trim();
        filteredRoom=filteredRoom.filter(
            (room)=>
               room.name.toLowerCase().includes(searchValue)||
               room.status.toLowerCase().includes(searchValue)
            
        )
    }
    if(params.sort){
        let sortBy;
        let sortOrder=1;
        if(typeof params.sort==="string"){
            sortBy=params.sort;
        }else{
            sortBy=Object.keys(params.sort)[0];
            sortOrder = params.sort[sortBy] === "asc" ? 1 : -1;
        }
        let fieldToSort;
        switch (sortBy){
            case "name":
                fieldToSort="name";
                break;
            case "-name":
                fieldToSort="name";
                sortOrder=-1;
                break;
            case "machine_quantity":
                fieldToSort="machine_quantity";
                break;
            case "-machine_quantity":
                fieldToSort="machine_quantity";
                sortOrder=-1;
                break;
            default:
                break;
        }
        if(fieldToSort){
            filteredRoom.sort((a, b) => {
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
    const totalRoom= filteredRoom.length;
    const totalPages=Math.ceil(totalRoom/params.limit);
    const startIndex=(params.page-1)*params.limit;
    const endIndex=Math.min(startIndex+params.limit,totalRoom);
    const currentPageData=filteredRoom.slice(startIndex,endIndex);
    filteredRoom=currentPageData.map((room)=>({
        ...room,
    }))
  
    const modifiedRoom =filteredRoom.map((room)=>{
        return room;
    })
    console.log(modifiedRoom);
    return {
        data:modifiedRoom,
        currentPage:params.page,
        totalPages:totalPages
    }
  },
 
  getAllRoomforShedule : async (params)  => {
        const response = {data: sampleroom};
        return response; 
    },
    updateRoomStatus:async(id,data)=>{
        const url=`/rooms/updateStatus/${id}`;
        const{is_active}=data;
        console.log(data,",",id);
        sampleroom.map((room)=>{
                if(room.id===id){
                    room.is_active=is_active;
           

                }
        
           
        });
    }
   
};
export default roomAPI;