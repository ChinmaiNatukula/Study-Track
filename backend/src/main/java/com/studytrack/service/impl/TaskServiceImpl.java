package com.studytrack.service.impl;

import com.studytrack.dto.TaskRequest;
import com.studytrack.dto.TaskResponse;
import com.studytrack.entity.Priority;
import com.studytrack.entity.Student;
import com.studytrack.entity.Subject;
import com.studytrack.entity.Task;
import com.studytrack.entity.TaskStatus;
import com.studytrack.exception.ResourceNotFoundException;
import com.studytrack.repository.TaskRepository;
import com.studytrack.security.SecurityUtils;
import com.studytrack.service.StudentService;
import com.studytrack.service.SubjectService;
import com.studytrack.service.TaskService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final StudentService studentService;
    private final SubjectService subjectService;

    public TaskServiceImpl(TaskRepository taskRepository, StudentService studentService, SubjectService subjectService) {
        this.taskRepository = taskRepository;
        this.studentService = studentService;
        this.subjectService = subjectService;
    }

    @Override
    @Transactional(readOnly = true)
    public List<TaskResponse> getTasks(TaskStatus status, Long subjectId, Priority priority) {
        Long studentId = SecurityUtils.getCurrentStudentId();
        List<Task> tasks = taskRepository.findFiltered(studentId, status, subjectId, priority);
        return tasks.stream().map(TaskResponse::new).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public TaskResponse getTaskById(Long id) {
        Task task = getStudentTaskEntity(id);
        return new TaskResponse(task);
    }

    @Override
    @Transactional
    public TaskResponse createTask(TaskRequest request) {
        Student student = studentService.getAuthenticatedStudentEntity();

        Subject subject = null;
        if (request.getSubjectId() != null) {
            subject = subjectService.getStudentSubjectEntity(request.getSubjectId());
        }

        Task task = new Task();
        task.setStudent(student);
        task.setSubject(subject);
        task.setTitle(request.getTitle().trim());
        task.setDescription(request.getDescription());
        task.setPriority(request.getPriority() != null ? request.getPriority() : Priority.MEDIUM);
        task.setStatus(request.getStatus() != null ? request.getStatus() : TaskStatus.PENDING);
        task.setDeadline(request.getDeadline());
        task.setEstimatedMinutes(request.getEstimatedMinutes() != null ? request.getEstimatedMinutes() : 60);

        Task saved = taskRepository.save(task);
        return new TaskResponse(saved);
    }

    @Override
    @Transactional
    public TaskResponse updateTask(Long id, TaskRequest request) {
        Task task = getStudentTaskEntity(id);

        Subject subject = null;
        if (request.getSubjectId() != null) {
            subject = subjectService.getStudentSubjectEntity(request.getSubjectId());
        }

        task.setTitle(request.getTitle().trim());
        task.setDescription(request.getDescription());
        if (request.getPriority() != null) {
            task.setPriority(request.getPriority());
        }
        if (request.getStatus() != null) {
            task.setStatus(request.getStatus());
        }
        task.setDeadline(request.getDeadline());
        if (request.getEstimatedMinutes() != null) {
            task.setEstimatedMinutes(request.getEstimatedMinutes());
        }
        task.setSubject(subject);

        Task updated = taskRepository.save(task);
        return new TaskResponse(updated);
    }

    @Override
    @Transactional
    public TaskResponse updateTaskStatus(Long id, TaskStatus status) {
        Task task = getStudentTaskEntity(id);
        task.setStatus(status);
        Task updated = taskRepository.save(task);
        return new TaskResponse(updated);
    }

    @Override
    @Transactional
    public void deleteTask(Long id) {
        Task task = getStudentTaskEntity(id);
        taskRepository.delete(task);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TaskResponse> getOverdueTasks() {
        Long studentId = SecurityUtils.getCurrentStudentId();
        List<Task> overdue = taskRepository.findOverdueTasks(studentId, LocalDateTime.now());
        return overdue.stream().map(TaskResponse::new).collect(Collectors.toList());
    }

    private Task getStudentTaskEntity(Long taskId) {
        Long studentId = SecurityUtils.getCurrentStudentId();
        return taskRepository.findByIdAndStudentId(taskId, studentId)
            .orElseThrow(() -> new ResourceNotFoundException("Task not found with ID: " + taskId));
    }
}
