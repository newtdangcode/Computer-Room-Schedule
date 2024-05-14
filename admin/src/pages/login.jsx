// Login.js

import React, { useState } from 'react';
import './login-style.css'; // Import the CSS file

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your login logic here
  };

  return (
    <div className='wrapper'>
        <form action="">
            <h1>Đăng nhập</h1>

            <div className='input-box'>
                <input type="text"
                placeholder='Tên đăng nhập' required />
            </div>

            <div className='input-box'>
                <input type="text"
                placeholder='Mật khẩu' required />
            </div>

            <div className='remember-forgot'>
                <label>
                    <input type="checkbox" /> Lưu mật khẩu
                </label>
                <a href="#">Quên mật khẩu?</a>
            </div>
            
            <button type='submit'>Đăng nhập</button>
        </form>
    </div>
  );
};

export default Login;
