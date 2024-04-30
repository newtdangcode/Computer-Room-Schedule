import PageLayout from "../../components/layout/pageLayout";
import './setting-style.css';

export default function Setting() {
  return <PageLayout title="Cài đặt">
    <div className="wrapperone">
      <div className="red-bar"></div>
      <div className="setting">
      <h1>Cài đặt</h1>
      <button>Tài khoản</button>
      <button>Đổi mật khẩu</button>
      </div>
    </div>
    </PageLayout>;
}
