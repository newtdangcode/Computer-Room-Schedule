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

CREATE TABLE class (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE
);
INSERT INTO class (name) VALUES 
('D21CQAT01-N'),
('D21CQCN01-N'),
('D21CQPT01-N'),
('D22CQAT01-N'),
('D22CQCN03-N');

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


CREATE TABLE student (
  code VARCHAR(255) PRIMARY KEY,
  account_id INT NOT NULL,
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  phone_number VARCHAR(255),
  class_id INT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (account_id) REFERENCES account(id),
  FOREIGN KEY (class_id) REFERENCES class(id)

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
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

INSERT INTO booking_status (name) VALUES
('Chờ xác nhận'),
('Đã xác nhận'),
('Đã huỷ'),
('Đã từ chối');

CREATE TABLE booking (
  id INT AUTO_INCREMENT PRIMARY KEY,
  room_code VARCHAR(255) NOT NULL,
  date DATE,
  shift_id INT NOT NULL,
  lecturer_code VARCHAR(255) NOT NULL,
  subject_id INT NOT NULL,
  status_id INT NOT NULL,
  semester_id INT NOT NULL,
  employee_code VARCHAR(255) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (room_code) REFERENCES room(code),
  FOREIGN KEY (shift_id) REFERENCES shift(id),
  FOREIGN KEY (lecturer_code) REFERENCES lecturer(code),
  FOREIGN KEY (subject_id) REFERENCES subject(id),
  FOREIGN KEY (status_id) REFERENCES room_status(id),
  FOREIGN KEY (semester_id) REFERENCES semester(id),
  FOREIGN KEY (employee_code) REFERENCES employee(code)

);

