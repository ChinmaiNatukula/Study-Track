-- ====================================================================
-- Study Track – Student Study Management System
-- Seed Data for Testing & Demonstration
-- Default Student: alex@studytrack.com / password123
-- ====================================================================

USE `study_track`;

-- Clean existing demo data safely if needed
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE `study_sessions`;
TRUNCATE TABLE `notes`;
TRUNCATE TABLE `exams`;
TRUNCATE TABLE `timetable_sessions`;
TRUNCATE TABLE `tasks`;
TRUNCATE TABLE `subjects`;
TRUNCATE TABLE `students`;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. Insert Demo Student
-- BCrypt hash for 'password123': $2a$10$qD5CkL93gTRxuudH1ydeFOn7SkZTEydmqnKDqKnC/V9qDOkKFmx86
INSERT INTO `students` (`id`, `name`, `email`, `password`, `course`, `semester`, `institution`, `target_weekly_hours`)
VALUES (1, 'Alex Johnson', 'alex@studytrack.com', '$2a$10$qD5CkL93gTRxuudH1ydeFOn7SkZTEydmqnKDqKnC/V9qDOkKFmx86', 'Computer Science & Engineering', 'Semester 5', 'Stanford University', 25);

-- 2. Insert Subjects
INSERT INTO `subjects` (`id`, `student_id`, `name`, `code`, `description`, `target_study_hours`, `color`) VALUES
(1, 1, 'Data Structures & Algorithms', 'CS301', 'Trees, Graphs, Dynamic Programming, and algorithm complexity analysis.', 45.0, '#3B82F6'),
(2, 1, 'Database Management Systems', 'CS304', 'Relational algebra, SQL, normalization, transaction processing, and indexing.', 35.0, '#8B5CF6'),
(3, 1, 'Cloud Computing & DevOps', 'CS310', 'AWS architectures, Docker, Kubernetes, CI/CD pipelines, and microservices.', 30.0, '#10B981'),
(4, 1, 'Machine Learning & AI', 'CS315', 'Supervised learning, neural networks, classification, and model optimization.', 40.0, '#F59E0B'),
(5, 1, 'Computer Networks', 'CS308', 'OSI layers, TCP/IP protocols, routing algorithms, socket programming, and network security.', 25.0, '#EC4899');

-- 3. Insert Tasks
INSERT INTO `tasks` (`id`, `student_id`, `subject_id`, `title`, `description`, `priority`, `status`, `deadline`, `estimated_minutes`, `completed_at`) VALUES
(1, 1, 1, 'Implement Red-Black Tree in Java', 'Complete insertion and rebalancing rotations with unit tests.', 'HIGH', 'COMPLETED', '2026-10-23 18:00:00', 120, '2026-10-23 17:30:00'),
(2, 1, 1, 'Solve 15 LeetCode DP Problems', 'Focus on 0/1 Knapsack, Coin Change, and Longest Common Subsequence.', 'HIGH', 'IN_PROGRESS', '2026-10-26 23:59:00', 180, NULL),
(3, 1, 2, 'Normalize Hospital DB to BCNF', 'Analyze functional dependencies and decompose relational schemas into 3NF and BCNF.', 'MEDIUM', 'IN_PROGRESS', '2026-10-27 20:00:00', 90, NULL),
(4, 1, 3, 'Deploy Spring Boot API to Docker & AWS ECS', 'Write optimized multi-stage Dockerfile and push image to ECR repository.', 'HIGH', 'PENDING', '2026-10-28 22:00:00', 150, NULL),
(5, 1, 4, 'Tune Random Forest Hyperparameters', 'Use GridSearchCV on Kaggle Housing Dataset to minimize RMSE.', 'MEDIUM', 'PENDING', '2026-10-29 19:00:00', 100, NULL),
(6, 1, 5, 'Wireshark Packet Analysis Lab Report', 'Inspect TCP 3-way handshake and analyze packet loss / retransmissions.', 'LOW', 'PENDING', '2026-10-31 17:00:00', 75, NULL),
(7, 1, 2, 'Design ER Diagram for Study Track App', 'Entities, relationships, cardinalities, and foreign keys documentation.', 'MEDIUM', 'COMPLETED', '2026-10-22 14:00:00', 60, '2026-10-22 13:45:00');

-- 4. Insert Timetable Sessions (Current & Upcoming Days)
INSERT INTO `timetable_sessions` (`id`, `student_id`, `subject_id`, `session_date`, `start_time`, `end_time`, `topic`, `room_or_link`, `is_completed`) VALUES
(1, 1, 1, '2026-10-24', '09:00:00', '10:30:00', 'Graph Algorithms: Dijkstra & Bellman-Ford', 'Hall B-204', 1),
(2, 1, 2, '2026-10-24', '11:00:00', '12:30:00', 'Query Optimization & B-Tree Indexes', 'Lab 3', 1),
(3, 1, 3, '2026-10-24', '14:30:00', '16:00:00', 'Kubernetes Pods, Services, and Deployments', 'Zoom Room #412', 0),
(4, 1, 4, '2026-10-25', '10:00:00', '11:30:00', 'Convolutional Neural Networks (CNNs)', 'Hall A-101', 0),
(5, 1, 1, '2026-10-25', '14:00:00', '15:30:00', 'Dynamic Programming Patterns: Grid & Interval', 'Study Lounge', 0),
(6, 1, 5, '2026-10-26', '09:30:00', '11:00:00', 'Transport Layer & Congestion Control', 'Hall C-105', 0),
(7, 1, 2, '2026-10-27', '15:00:00', '16:30:00', 'ACID Transactions & Two-Phase Locking', 'Library Quiet Zone', 0);

-- 5. Insert Exams
INSERT INTO `exams` (`id`, `student_id`, `subject_id`, `exam_name`, `exam_date`, `location`, `syllabus`, `syllabus_completion_percentage`, `preparation_status`, `target_score`) VALUES
(1, 1, 1, 'Midterm Examination: Algorithms', '2026-10-30 09:00:00', 'Exam Hall 102', 'Asymptotic analysis, divide & conquer, greedy methods, dynamic programming, basic graph algorithms.', 75, 'IN_PROGRESS', 'A+ / 95%'),
(2, 1, 2, 'DBMS Practical & Viva', '2026-11-04 13:30:00', 'Computer Lab 4', 'Advanced SQL joins, subqueries, triggers, stored procedures, and index execution plans.', 60, 'IN_PROGRESS', 'A / 90%'),
(3, 1, 4, 'Machine Learning Quiz 2', '2026-11-09 11:00:00', 'Room 305', 'Linear regression, Logistic regression, Decision trees, SVMs, cross-validation metrics.', 40, 'NOT_STARTED', '85%'),
(4, 1, 3, 'Cloud Practitioner Certification Exam', '2026-11-18 10:00:00', 'Pearson VUE Testing Center', 'Cloud concepts, security and compliance, core AWS services, billing and pricing models.', 85, 'READY', 'Score 850+'),
(5, 1, 5, 'Final Semester Theory: Computer Networks', '2026-11-28 14:00:00', 'Main Auditorium', 'Complete syllabus: Physical layer to Application layer protocols, cryptography basics.', 20, 'NOT_STARTED', 'A / 92%');

-- 6. Insert Notes
INSERT INTO `notes` (`id`, `student_id`, `subject_id`, `title`, `topic`, `content`, `tags`, `is_pinned`) VALUES
(1, 1, 1, 'Mastering Dynamic Programming: Tabulation vs Memoization', 'Dynamic Programming', '# Dynamic Programming Cheatsheet\n\n### Top-Down (Memoization)\n- Start from original problem and break into subproblems recursively.\n- Cache results in a hash table or array.\n- Time Complexity: O(states * transitions).\n\n### Bottom-Up (Tabulation)\n- Solve smallest subproblems first and iteratively build solutions to larger ones.\n- Avoids recursion call stack overhead.\n- Often allows space optimization (e.g., maintaining only previous row).\n\n```java\n// Fibonacci with space optimization\nint a = 0, b = 1;\nfor (int i = 2; i <= n; i++) {\n    int c = a + b;\n    a = b;\n    b = c;\n}\n```', 'algorithms, dp, recursion, complexity', 1),
(2, 1, 2, 'SQL Normalization: 1NF to BCNF Simplified', 'Database Normalization', '# Normalization Guidelines\n\n1. **1NF**: Atomic values, no repeating groups, unique column names.\n2. **2NF**: In 1NF and no partial dependencies (all non-key attributes fully dependent on candidate key).\n3. **3NF**: In 2NF and no transitive dependencies (non-prime attribute must not determine another non-prime).\n4. **BCNF**: For every functional dependency `X -> Y`, `X` must be a super key.', 'sql, dbms, normalization, keys', 1),
(3, 1, 3, 'Docker Multi-Stage Build for Spring Boot Apps', 'Containerization', '# Production Dockerfile for Spring Boot\n\n```dockerfile\n# Stage 1: Build\nFROM maven:3.9-eclipse-temurin-21 AS build\nWORKDIR /app\nCOPY pom.xml .\nRUN mvn dependency:go-offline\nCOPY src ./src\nRUN mvn clean package -DskipTests\n\n# Stage 2: Runtime\nFROM eclipse-temurin:21-jre-alpine\nWORKDIR /app\nCOPY --from=build /app/target/*.jar app.jar\nEXPOSE 8080\nENTRYPOINT ["java", "-jar", "app.jar"]\n```', 'devops, docker, spring-boot, cloud', 0),
(4, 1, 4, 'Bias-Variance Tradeoff & Regularization', 'Model Evaluation', '# Understanding Model Error\n\nTotal Error = Bias^2 + Variance + Irreducible Error\n\n- **High Bias**: Underfitting (model too simplistic). Solution: Add features, decrease regularization, use deeper models.\n- **High Variance**: Overfitting (model memorizes noise). Solution: More data, feature selection, increase L1 (Lasso) or L2 (Ridge) penalty.', 'machine-learning, statistics, overfitting', 0);

-- 7. Insert Logged Study Sessions (for historical progress charts)
INSERT INTO `study_sessions` (`id`, `student_id`, `subject_id`, `topic`, `session_date`, `duration_minutes`, `notes`) VALUES
(1, 1, 1, 'Graph Representation & BFS/DFS', '2026-10-18', 90, 'Solved 4 problems on connected components and topological sort.'),
(2, 1, 2, 'Indexing & EXPLAIN Plans in MySQL', '2026-10-19', 120, 'Compared table scans with B-Tree indexes on 100k rows.'),
(3, 1, 3, 'Docker Compose & Networking', '2026-10-20', 75, 'Configured multi-container app with MySQL and Spring backend.'),
(4, 1, 1, 'DP: Knapsack & Subset Sum', '2026-10-21', 110, 'Implemented both recursive memoization and 1D array space optimization.'),
(5, 1, 4, 'Linear & Logistic Regression from scratch', '2026-10-22', 130, 'Derived gradient descent formulas and cost functions in Python.'),
(6, 1, 5, 'Subnetting & CIDR calculations', '2026-10-23', 80, 'Practiced IP address range calculations and subnet masks.'),
(7, 1, 1, 'Dijkstra and Priority Queue', '2026-10-24', 90, 'Graph pathfinding practice with Adjacency List.');
