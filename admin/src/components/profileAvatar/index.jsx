import { IconProfileAvatar } from "../icon";
import styles from "./styles.module.css";
export default function ProfileAvatar() {
  return (
    <div className={`${styles.avatar}`}>
      <div className="text-xl w-[25px] h-[25px]">{<IconProfileAvatar />}</div>
    </div>
  );
}
