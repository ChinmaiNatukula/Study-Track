package com.studytrack.controller;

import com.studytrack.dto.ApiResponse;
import com.studytrack.dto.TaskRequest;
import com.studytrack.dto.TaskResponse;
import com.studytrack.entity.Priority;
import com.studytrack.entity.TaskStatus;
import com.studytrack.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<TaskResponse>>> getTasks(
        @RequestParam(required = false) TaskStatus status,
        @RequestParam(required = false) Long subjectId,
        @RequestParam(required = false) Priority priority
    ) {
        List<TaskResponse> tasks = taskService.getTasks(status, subjectId, priority);
        return ResponseEntity.ok(ApiResponse.ok("Tasks retrieved", tasks));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TaskResponse>> getTaskById(@PathVariable Long id) {
        TaskResponse response = taskService.getTaskById(id);
        return ResponseEntity.ok(ApiResponse.ok("Task retrieved", response));
    }

    @GetMapping("/overdue")
    public ResponseEntity<ApiResponse<List<TaskResponse>>> getOverdueTasks() {
        List<TaskResponse> overdue = taskService.getOverdueTasks();
        return ResponseEntity.ok(ApiResponse.ok("Overdue tasks retrieved", overdue));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<TaskResponse>> createTask(@Valid @RequestBody TaskRequest request) {
        TaskResponse response = taskService.createTask(request);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.ok("Task created successfully", response));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TaskResponse>> updateTask(
        @PathVariable Long id,
        @Valid @RequestBody TaskRequest request
    ) {
        TaskResponse response = taskService.updateTask(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Task updated successfully", response));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<TaskResponse>> updateTaskStatus(
        @PathVariable Long id,
        @RequestBody Map<String, String> payload
    ) {
        String statusStr = payload.get("status");
        TaskStatus status = TaskStatus.valueOf(statusStr.toUpperCase());
        TaskResponse response = taskService.updateTaskStatus(id, status);
        return ResponseEntity.ok(ApiResponse.ok("Task status updated", response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
        return ResponseEntity.ok(ApiResponse.ok("Task deleted successfully", null));
    }
}
