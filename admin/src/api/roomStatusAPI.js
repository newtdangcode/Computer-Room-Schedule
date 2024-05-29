import axios from "./axios"
import removeAccents from "../utils/removeAccents";
const RoomStatusApi={
    getAllWithoutParams:async()=>{
        const access_token =await localStorage.getItem("access_token");
        const url="/roomStatus/get-all";
        const response =await axios.get(url,{
            headers:{
                Authorization:`Bearer ${access_token}`,
            },
        })
        console.log(response)
        return response;
    },
    getAll:async(params)=>{
        if(params.is_active===undefined){
            params.filter="is_active:eq:true";
        }
        else{
            params.filter="is_active:eq:"+params.is_active;
            delete params.is_active;
        }

        if(params.search!==""){
            params.search=removeAccents(params.search);
            params.filter=params.filter+",name:like:"+params.search;
        }
        const access_token =await localStorage.getItem("access_token");
        delete params.search;
        const url="/roomStatus/get-all";
        const response =await axios.get(url,{
            params,
            headers:{
                Authorization:`Bearer ${access_token}`,
            },
        })
        return response;
      
    },
}
export default RoomStatusApi;
   
