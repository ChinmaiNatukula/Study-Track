package com.studytrack.controller;

import com.studytrack.dto.ApiResponse;
import com.studytrack.dto.DashboardStatsResponse;
import com.studytrack.dto.ProgressStatsResponse;
import com.studytrack.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/dashboard/stats")
    public ResponseEntity<ApiResponse<DashboardStatsResponse>> getDashboardStats() {
        DashboardStatsResponse stats = dashboardService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.ok("Dashboard statistics retrieved", stats));
    }

    @GetMapping("/progress/stats")
    public ResponseEntity<ApiResponse<ProgressStatsResponse>> getProgressStats() {
        ProgressStatsResponse stats = dashboardService.getProgressStats();
        return ResponseEntity.ok(ApiResponse.ok("Progress statistics retrieved", stats));
    }
}
