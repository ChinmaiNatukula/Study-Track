package com.studytrack.service;

import com.studytrack.dto.DashboardStatsResponse;
import com.studytrack.dto.ProgressStatsResponse;

public interface DashboardService {
    DashboardStatsResponse getDashboardStats();
    ProgressStatsResponse getProgressStats();
}
