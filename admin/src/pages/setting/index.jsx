import PageLayout from "../../components/layout/pageLayout";
import React, { useEffect, useState } from "react";
import { IconImport, IconBin, IconAdd, IconDelete, IconBack, IconRestore } from "../../components/icon";
import Swal from "sweetalert2";
import './setting-style.css';

export default function Setting() {
  const [userInfoActive, setUserInfoActive] = useState(true);
  const [passChangeActive, setPassChangeActive] = useState(false);

  const toggleUserInfo = () => {
    setUserInfoActive(true);
    if (passChangeActive) {
      setPassChangeActive(false);
    }
    console.log ("button is active");
  }
  const toggleChangePassword = () => {
    setPassChangeActive(true);
    if (userInfoActive) {
      setUserInfoActive(false);
    }
    console.log ("pass-button is active");
  }
  return (
  <PageLayout title="Cài đặt">
    <div className="wrapper">
      <div className="setting-bar">
        <div className="red-bar-ver-1"></div>
          <h1>Cài đặt</h1>
          <div className="red-bar-hor-1"></div>
          <button id="showUserInfo"
              onClick={toggleUserInfo}
              className={`active-button ${userInfoActive ? 'active' : ''}`}
          >Tài khoản</button>
          <button id="changePassword"
              onClick={toggleChangePassword}
              className={`active-button ${passChangeActive ? 'active' : ''}`}
          >Đổi mật khẩu</button>
      </div>
      {userInfoActive && (
      <div className="user-info" style={{ opacity: userInfoActive ? 1 : 0, transform: userInfoActive ? 'translateX(0)' : 'translateX(-100%)' }}>
          <div className="red-bar-ver-2"></div>
          <div className="account">
            <h1>Thông tin cá nhân</h1>
            <div className="last-name">
              <label htmlFor="lastname">Họ</label>
              <input type="text" id="lastname" name="lastname" />
            </div>
            <div className="first-name">
              <label htmlFor="firstname">Tên</label>
              <input type="text" id="firstname" name="firstname" />
            </div>
            <div className="email">
              <label htmlFor="email">Địa chỉ Email</label>
              <input type="email" id="email" name="email" />
            </div>
            <div className="phonenum">
              <label htmlFor="phonenum">Số điện thoại</label>
              <input type="tel" id="phonenum" name="phonenum" />
            </div>
            
            <button
                  onClick={() => {
                    Swal.fire({
                      title: "Lưu thay đổi",
                      text: "Bạn chắc chắn muốn lưu thay đổi?",
                      icon: "question",
                      showCancelButton: true,
                      confirmButtonColor: "#0E9F6E",
                      cancelButtonColor: "#d33",
                      cancelButtonText: "Huỷ bỏ",
                      confirmButtonText: "Đồng ý!",
                    }).then((result) => {
                      if (result.isConfirmed) {
                        //handleSoftDeleteManystudent();
                        Swal.fire({
                          title: "Thành công !",
                          text: "Lưu thay đổi thành công",
                          confirmButtonColor: "#0E9F6E",
                        });
                      }
                    });
                  }}
                  className="h-12 align-bottom inline-flex leading-5 items-center justify-center 
                  cursor-pointer transition-colors duration-150 font-medium px-4 py-2 rounded-lg text-sm 
                  text-white bg-primary border border-transparent hover:bg-[#a41c15] "
                >
                  Lưu thay đổi
                </button>
          </div>
      </div>
      )}
  {passChangeActive && (
      <div className="password-change" style={{ opacity: passChangeActive ? 1 : 0, transform: passChangeActive ? 'translateX(0)' : 'translateX(-100%)' }}>
          <div className="red-bar-ver-2"></div>
          <div className="account">
            <h1>Thay đổi mật khẩu</h1>
            <div className="old-pass">
              <label htmlFor="oldpass">Mật khẩu cũ</label>
              <input type="password" id="oldpass" name="oldpass" />
            </div>
            <div className="new-pass">
              <label htmlFor="newpass">Mật khẩu mới</label>
              <input type="password" id="newpass" name="newpass" />
            </div>
            <button
                  onClick={() => {
                    Swal.fire({
                      title: "Lưu thay đổi",
                      text: "Bạn chắc chắn muốn lưu thay đổi?",
                      icon: "question",
                      showCancelButton: true,
                      confirmButtonColor: "#0E9F6E",
                      cancelButtonColor: "#d33",
                      cancelButtonText: "Huỷ bỏ",
                      confirmButtonText: "Đồng ý!",
                    }).then((result) => {
                      if (result.isConfirmed) {
                        //handleSoftDeleteManystudent();
                        Swal.fire({
                          title: "Thành công !",
                          text: "Lưu thay đổi thành công",
                          confirmButtonColor: "#0E9F6E",
                        });
                      }
                    });
                  }}
                  className="h-12 align-bottom inline-flex leading-5 items-center justify-center 
                  cursor-pointer transition-colors duration-150 font-medium px-4 py-2 rounded-lg text-sm 
                  text-white bg-primary border border-transparent hover:bg-[#a41c15] "
                >
                  Lưu thay đổi
                </button>
          </div>
      </div>
      )}
    </div>
    </PageLayout>
  );
}