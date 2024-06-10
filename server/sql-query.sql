CREATE TABLE Role (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);
INSERT INTO Role (name) VALUES
('Quản lý'),
('Nhân viên'),
('Giảng viên'),
('Sinh viên');



CREATE TABLE account (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  refresh_token VARCHAR(255),
  email VARCHAR(255) NOT NULL,
  role_id INT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (role_id) REFERENCES role(id)
);

CREATE TABLE lecturer (
  code VARCHAR(255) PRIMARY KEY,
  account_id INT NOT NULL,
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  phone_number VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (account_id) REFERENCES account(id)
);



CREATE TABLE employee (
  code VARCHAR(255) PRIMARY KEY,
  account_id INT NOT NULL,
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  phone_number VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (account_id) REFERENCES account(id)
);

INSERT INTO account (username, password, refresh_token, email, role_id)
VALUES ('admin001', '$2b$10$nu49VlJbiZ.s7LCwEqkx.ecChtrHoKDXO9l/M20/L80e5mtfV09LC', NULL, 'admin001@gmail.com', 1);
INSERT INTO employee (code, account_id, first_name, last_name, phone_number)
VALUES ('ADMIN001', 1, 'web', 'admin', '0123456789');

CREATE TABLE class (
  code VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  lecturer_code VARCHAR(255) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (lecturer_code) REFERENCES lecturer(code)
);


CREATE TABLE student (
  code VARCHAR(255) PRIMARY KEY,
  account_id INT NOT NULL,
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  phone_number VARCHAR(255),
  class_code VARCHAR(255) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (account_id) REFERENCES account(id),
  FOREIGN KEY (class_code) REFERENCES class(code)
);


CREATE TABLE room_status (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

INSERT INTO room_status (name) VALUES
('Đang hoạt động'),
('Đang bảo trì'),
('Ngừng hoạt động');

CREATE TABLE room (
  code VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) ,
  machine_quantity INT,
  employee_code VARCHAR(255) NOT NULL,
  status_id INT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_code) REFERENCES employee(code),
  FOREIGN KEY (status_id) REFERENCES room_status(id)
);


CREATE TABLE semester (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  start_time DATE,
  end_time DATE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE subject (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(255) NOT NULL,
  lecturer_code VARCHAR(255) NOT NULL,
  semester_id INT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (lecturer_code) REFERENCES lecturer(code),
  FOREIGN KEY (semester_id) REFERENCES semester(id)
);

CREATE TABLE subject_student (
  subject_id INT NOT NULL,
  student_code VARCHAR(255) NOT NULL,
  FOREIGN KEY (subject_id) REFERENCES subject(id),
  FOREIGN KEY (student_code) REFERENCES student(code)
);


CREATE TABLE shift (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

INSERT INTO shift (name) VALUES
('Sáng'),
('Chiều');

CREATE TABLE booking_status (
    id INT PRIMARY KEY NOT NULL,
    name VARCHAR(255) NOT NULL
);

INSERT INTO booking_status (id, name) VALUES
(1,'Chờ xác nhận'),
(2,'Đã xác nhận'),
(3,'Đã huỷ'),
(4,'Đã từ chối');

CREATE TABLE booking (
  id INT AUTO_INCREMENT PRIMARY KEY,
  room_code VARCHAR(255) NOT NULL,
  date DATE,
  shift_id INT NOT NULL,
  lecturer_code VARCHAR(255) NOT NULL,
  subject_id INT NOT NULL,
  status_id INT NOT NULL,
  semester_id INT NOT NULL,
  employee_code VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (room_code) REFERENCES room(code),
  FOREIGN KEY (shift_id) REFERENCES shift(id),
  FOREIGN KEY (lecturer_code) REFERENCES lecturer(code),
  FOREIGN KEY (subject_id) REFERENCES subject(id),
  FOREIGN KEY (status_id) REFERENCES booking_status(id),
  FOREIGN KEY (semester_id) REFERENCES semester(id),
  FOREIGN KEY (employee_code) REFERENCES employee(code)

);

CREATE TABLE notification(
  id INT AUTO_INCREMENT PRIMARY KEY,
  account_id INT NOT NULL,
  content VARCHAR(255),
  unread BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (account_id) REFERENCES account(id)
);
