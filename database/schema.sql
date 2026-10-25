-- ====================================================================
-- Study Track – Student Study Management System
-- Database Schema for MySQL 8.x / 9.x
-- ====================================================================

CREATE DATABASE IF NOT EXISTS `study_track`
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE `study_track`;

-- 1. Students Table
CREATE TABLE IF NOT EXISTS `students` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(120) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `course` VARCHAR(100),
    `semester` VARCHAR(50),
    `institution` VARCHAR(150),
    `target_weekly_hours` INT DEFAULT 20,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. Subjects Table
CREATE TABLE IF NOT EXISTS `subjects` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `student_id` BIGINT NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `code` VARCHAR(30) NOT NULL,
    `description` TEXT,
    `target_study_hours` DOUBLE DEFAULT 30.0,
    `color` VARCHAR(20) DEFAULT '#3B82F6',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_subjects_student` FOREIGN KEY (`student_id`) 
        REFERENCES `students` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 3. Tasks Table
CREATE TABLE IF NOT EXISTS `tasks` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `student_id` BIGINT NOT NULL,
    `subject_id` BIGINT NULL,
    `title` VARCHAR(200) NOT NULL,
    `description` TEXT,
    `priority` VARCHAR(20) NOT NULL DEFAULT 'MEDIUM', -- LOW, MEDIUM, HIGH, URGENT
    `status` VARCHAR(20) NOT NULL DEFAULT 'PENDING',    -- PENDING, IN_PROGRESS, COMPLETED
    `deadline` DATETIME NULL,
    `estimated_minutes` INT DEFAULT 60,
    `completed_at` DATETIME NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_tasks_student` FOREIGN KEY (`student_id`) 
        REFERENCES `students` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_tasks_subject` FOREIGN KEY (`subject_id`) 
        REFERENCES `subjects` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 4. Timetable Sessions Table
CREATE TABLE IF NOT EXISTS `timetable_sessions` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `student_id` BIGINT NOT NULL,
    `subject_id` BIGINT NOT NULL,
    `session_date` DATE NOT NULL,
    `start_time` TIME NOT NULL,
    `end_time` TIME NOT NULL,
    `topic` VARCHAR(200) NOT NULL,
    `room_or_link` VARCHAR(200),
    `is_completed` BOOLEAN DEFAULT FALSE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_timetable_student` FOREIGN KEY (`student_id`) 
        REFERENCES `students` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_timetable_subject` FOREIGN KEY (`subject_id`) 
        REFERENCES `subjects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 5. Exams Table
CREATE TABLE IF NOT EXISTS `exams` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `student_id` BIGINT NOT NULL,
    `subject_id` BIGINT NOT NULL,
    `exam_name` VARCHAR(150) NOT NULL,
    `exam_date` DATETIME NOT NULL,
    `location` VARCHAR(150),
    `syllabus` TEXT,
    `syllabus_completion_percentage` INT DEFAULT 0,
    `preparation_status` VARCHAR(30) NOT NULL DEFAULT 'NOT_STARTED', -- NOT_STARTED, IN_PROGRESS, READY, MASTERED
    `target_score` VARCHAR(20),
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_exams_student` FOREIGN KEY (`student_id`) 
        REFERENCES `students` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_exams_subject` FOREIGN KEY (`subject_id`) 
        REFERENCES `subjects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 6. Notes Table
CREATE TABLE IF NOT EXISTS `notes` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `student_id` BIGINT NOT NULL,
    `subject_id` BIGINT NOT NULL,
    `title` VARCHAR(200) NOT NULL,
    `topic` VARCHAR(150),
    `content` LONGTEXT NOT NULL,
    `tags` VARCHAR(255),
    `is_pinned` BOOLEAN DEFAULT FALSE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_notes_student` FOREIGN KEY (`student_id`) 
        REFERENCES `students` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_notes_subject` FOREIGN KEY (`subject_id`) 
        REFERENCES `subjects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 7. Study Sessions Table (Logged Study Hours & Activity)
CREATE TABLE IF NOT EXISTS `study_sessions` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `student_id` BIGINT NOT NULL,
    `subject_id` BIGINT NOT NULL,
    `topic` VARCHAR(200),
    `session_date` DATE NOT NULL,
    `duration_minutes` INT NOT NULL,
    `notes` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_studysessions_student` FOREIGN KEY (`student_id`) 
        REFERENCES `students` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_studysessions_subject` FOREIGN KEY (`subject_id`) 
        REFERENCES `subjects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Indexes for performance
CREATE INDEX `idx_tasks_student_status` ON `tasks` (`student_id`, `status`);
CREATE INDEX `idx_timetable_student_date` ON `timetable_sessions` (`student_id`, `session_date`);
CREATE INDEX `idx_exams_student_date` ON `exams` (`student_id`, `exam_date`);
CREATE INDEX `idx_studysessions_student_date` ON `study_sessions` (`student_id`, `session_date`);
CREATE INDEX `idx_notes_student_subject` ON `notes` (`student_id`, `subject_id`);
