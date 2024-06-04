import { Link } from "react-router-dom";
import { fetchNotification } from "../../../features/auth/notificationSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import notificationAPI from "../../../api/notificationAPI";
import formatTimestamp from "../../../utils/formatTimestamp";

export default function NotificationItem({ data }) {
  const dispatch = useDispatch();

  const handleClickNotification = async (id) => {
    try {
      await notificationAPI.updateNotification(id);
      unwrapResult(await dispatch(fetchNotification()));
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <Link
      to={`/bookings`}
      onClick={() => handleClickNotification(data.id)}
      className={`${
        data.unread ? "bg-gray-200" : "bg-white"
      } flex justify-between items-center text-sm py-3 px-3 border-b border-gray-100 hover:border-gray-700 transition-colors duration-150  hover:text-gray-800 cursor-pointer`}
    >
      <div className="flex items-center">
        
        <div className="pl-2">
          <h6 className="font-medium text-gray-500">{data.content}</h6>
          <p className="text-xs text-gray-400">
            <span>{formatTimestamp(data.created_at)}</span>
          </p>
        </div>
      </div>
    </Link>
  );
}
