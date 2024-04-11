import { IconProfileAvatar } from "../icon";
import styles from "./styles.module.css";
export default function ProfileAvatar({ url, size = 24, isActive }) {
  return (
    <div className={`${styles.avatar}`}>
      <div className="text-xl w-6 h-6">{<IconProfileAvatar />}</div>
    </div>
  );
}
