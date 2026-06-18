-- MySQL Script for Campus Placement Management System
-- Database: placement_management

CREATE DATABASE IF NOT EXISTS `placement_management`;
USE `placement_management`;

-- 1. Roles Table
CREATE TABLE IF NOT EXISTS `roles` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Users Table
CREATE TABLE IF NOT EXISTS `users` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `email` VARCHAR(100) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `role_id` BIGINT NOT NULL,
    `is_active` BOOLEAN DEFAULT TRUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_user_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Companies Table
CREATE TABLE IF NOT EXISTS `companies` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `company_name` VARCHAR(150) NOT NULL UNIQUE,
    `industry` VARCHAR(100),
    `hr_name` VARCHAR(100),
    `email` VARCHAR(100) NOT NULL UNIQUE,
    `phone` VARCHAR(20),
    `website` VARCHAR(150),
    `address` TEXT,
    `description` TEXT,
    `is_approved` BOOLEAN DEFAULT FALSE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Students Table
CREATE TABLE IF NOT EXISTS `students` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT NOT NULL UNIQUE,
    `name` VARCHAR(100) NOT NULL,
    `phone` VARCHAR(20),
    `gender` VARCHAR(10),
    `dob` DATE,
    `address` TEXT,
    `department` VARCHAR(100),
    `branch` VARCHAR(100),
    `cgpa` DECIMAL(4,2),
    `passing_year` INT,
    `skills` TEXT,
    `projects` TEXT,
    `certifications` TEXT,
    `internships` TEXT,
    `linkedin` VARCHAR(150),
    `github` VARCHAR(150),
    `resume_path` VARCHAR(255),
    `is_verified` BOOLEAN DEFAULT FALSE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_student_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Recruiters Table
CREATE TABLE IF NOT EXISTS `recruiters` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT NOT NULL UNIQUE,
    `company_id` BIGINT,
    `name` VARCHAR(100) NOT NULL,
    `phone` VARCHAR(20),
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_recruiter_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_recruiter_company` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Jobs Table
CREATE TABLE IF NOT EXISTS `jobs` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `company_id` BIGINT NOT NULL,
    `title` VARCHAR(150) NOT NULL,
    `description` TEXT NOT NULL,
    `package_amount` DECIMAL(10,2) NOT NULL, -- e.g. LPA (Lakhs Per Annum)
    `job_type` VARCHAR(50) NOT NULL, -- e.g. Full-time, Internship
    `location` VARCHAR(100) NOT NULL,
    `skills_required` TEXT NOT NULL,
    `min_cgpa` DECIMAL(4,2) NOT NULL,
    `batch_year` INT NOT NULL,
    `deadline` DATE NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_job_company` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Applications Table
CREATE TABLE IF NOT EXISTS `applications` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `student_id` BIGINT NOT NULL,
    `job_id` BIGINT NOT NULL,
    `status` VARCHAR(50) DEFAULT 'APPLIED', -- APPLIED, UNDER_REVIEW, SHORTLISTED, INTERVIEW_SCHEDULED, SELECTED, REJECTED
    `resume_path` VARCHAR(255),
    `applied_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `remarks` TEXT,
    CONSTRAINT `fk_application_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_application_job` FOREIGN KEY (`job_id`) REFERENCES `jobs` (`id`) ON DELETE CASCADE,
    UNIQUE KEY `unique_student_job` (`student_id`, `job_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Placement Drives Table
CREATE TABLE IF NOT EXISTS `placement_drives` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `drive_name` VARCHAR(150) NOT NULL,
    `company_id` BIGINT NOT NULL,
    `date` DATE NOT NULL,
    `time` TIME NOT NULL,
    `venue` VARCHAR(255) NOT NULL,
    `eligibility_criteria` TEXT,
    `registration_deadline` DATE NOT NULL,
    `status` VARCHAR(50) DEFAULT 'UPCOMING', -- UPCOMING, ONGOING, COMPLETED, CANCELLED
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_drive_company` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Interviews Table
CREATE TABLE IF NOT EXISTS `interviews` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `application_id` BIGINT NOT NULL,
    `date` DATE NOT NULL,
    `time` TIME NOT NULL,
    `mode` VARCHAR(50) NOT NULL, -- ONLINE, OFFLINE
    `meeting_link` VARCHAR(255),
    `feedback` TEXT,
    `status` VARCHAR(50) DEFAULT 'SCHEDULED', -- SCHEDULED, COMPLETED, CANCELLED, RESCHEDULED
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_interview_application` FOREIGN KEY (`application_id`) REFERENCES `applications` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Notifications Table
CREATE TABLE IF NOT EXISTS `notifications` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT NOT NULL,
    `title` VARCHAR(150) NOT NULL,
    `message` TEXT NOT NULL,
    `is_read` BOOLEAN DEFAULT FALSE,
    `type` VARCHAR(50) NOT NULL, -- JOB, INTERVIEW, PLACEMENT_DRIVE, SYSTEM, CHAT
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_notification_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. Refresh Tokens Table
CREATE TABLE IF NOT EXISTS `refresh_tokens` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT NOT NULL UNIQUE,
    `token` VARCHAR(255) NOT NULL UNIQUE,
    `expiry_date` TIMESTAMP NOT NULL,
    CONSTRAINT `fk_refresh_token_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. Audit Logs Table
CREATE TABLE IF NOT EXISTS `audit_logs` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `action` VARCHAR(100) NOT NULL,
    `user_id` BIGINT,
    `timestamp` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `details` TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed Data: Roles
INSERT INTO `roles` (`id`, `name`) VALUES
(1, 'ROLE_ADMIN'),
(2, 'ROLE_OFFICER'),
(3, 'ROLE_STUDENT'),
(4, 'ROLE_RECRUITER')
ON DUPLICATE KEY UPDATE `name`=VALUES(`name`);

-- Seed Data: Default Admin and Placement Officer Accounts
-- Default passwords are encrypted with BCrypt (password is 'admin123' and 'officer123' respectively)
-- Admin: admin@placement.com / admin123
-- Officer: officer@placement.com / officer123
INSERT INTO `users` (`id`, `email`, `password`, `role_id`, `is_active`) VALUES
(1, 'admin@placement.com', '$2a$10$8z.q5e.k.K1eZ7qE2Xv9yOd7x9yT9J6s.XwZpC.Lw9pT4h3c/V/72', 1, 1),
(2, 'officer@placement.com', '$2a$10$vN.1yGZ7RWhq8V/b7qO0n.T2U5v7EpxN3.bN97W3G2D96lXw/nCG.', 2, 1)
ON DUPLICATE KEY UPDATE `email`=VALUES(`email`);

-- Indexes for performance
CREATE INDEX `idx_job_company` ON `jobs` (`company_id`);
CREATE INDEX `idx_student_user` ON `students` (`user_id`);
CREATE INDEX `idx_recruiter_user` ON `recruiters` (`user_id`);
CREATE INDEX `idx_app_student` ON `applications` (`student_id`);
CREATE INDEX `idx_app_job` ON `applications` (`job_id`);
CREATE INDEX `idx_notification_user` ON `notifications` (`user_id`);
