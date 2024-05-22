export default function formatDate(inputDate) {
    const date = new Date(inputDate);
  
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    
  
    const formattedDate = `${day.toString().padStart(2, "0")}/${month.toString().padStart(2, "0")}/${year.toString()}`;
    
  
    return formattedDate;
  }
  