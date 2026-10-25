package com.studytrack.service;

import com.studytrack.dto.TaskRequest;
import com.studytrack.dto.TaskResponse;
import com.studytrack.entity.Priority;
import com.studytrack.entity.TaskStatus;

import java.util.List;

public interface TaskService {
    List<TaskResponse> getTasks(TaskStatus status, Long subjectId, Priority priority);
    TaskResponse getTaskById(Long id);
    TaskResponse createTask(TaskRequest request);
    TaskResponse updateTask(Long id, TaskRequest request);
    TaskResponse updateTaskStatus(Long id, TaskStatus status);
    void deleteTask(Long id);
    List<TaskResponse> getOverdueTasks();
}
