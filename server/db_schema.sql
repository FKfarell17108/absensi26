CREATE DATABASE IF NOT EXISTS absensi_db;
USE absensi_db;

-- Jurusan (Majors)
CREATE TABLE IF NOT EXISTS majors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE
);

-- Kelas (Classes)
CREATE TABLE IF NOT EXISTS classes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  major_id INT,
  FOREIGN KEY (major_id) REFERENCES majors(id) ON DELETE SET NULL
);

-- Users (Students, Teachers, Admins)
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE, -- NIS for Students, NIP for Teachers
  password VARCHAR(255) NOT NULL,
  role ENUM('student', 'teacher', 'admin') NOT NULL,
  name VARCHAR(100) NOT NULL,
  class_id INT NULL, -- Only for students
  major_id INT NULL, -- Optional for teachers if assigned to a major
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE SET NULL,
  FOREIGN KEY (major_id) REFERENCES majors(id) ON DELETE SET NULL
);

-- Absensi (Attendance)
CREATE TABLE IF NOT EXISTS attendance (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  date DATE NOT NULL,
  status ENUM('hadir', 'sakit', 'izin', 'alpha') NOT NULL,
  photo_url VARCHAR(255),
  notes TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_attendance (user_id, date) -- Ensures one attendance per day
);

-- Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  action VARCHAR(255) NOT NULL,
  details TEXT,
  ip_address VARCHAR(50),
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Seed Data: Jurusan
INSERT IGNORE INTO majors (name) VALUES 
('KGS'), ('TEK'), ('TITL'), ('TFLM'), ('TKR'), ('SIJA');
