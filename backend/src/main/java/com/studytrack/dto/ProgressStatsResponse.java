package com.studytrack.dto;

import java.util.List;

public class ProgressStatsResponse {
    private double allTimeHours;
    private double monthlyHours;
    private double weeklyHours;
    private double todayHours;
    private long totalSessionsCount;
    private long totalCompletedTasks;
    private long totalPendingTasks;
    private double taskCompletionRate;

    private List<DashboardStatsResponse.DailyStudyPoint> last30DaysChart;
    private List<DashboardStatsResponse.SubjectProgressPoint> subjectPerformance;

    public ProgressStatsResponse() {
    }

    public double getAllTimeHours() {
        return allTimeHours;
    }

    public void setAllTimeHours(double allTimeHours) {
        this.allTimeHours = allTimeHours;
    }

    public double getMonthlyHours() {
        return monthlyHours;
    }

    public void setMonthlyHours(double monthlyHours) {
        this.monthlyHours = monthlyHours;
    }

    public double getWeeklyHours() {
        return weeklyHours;
    }

    public void setWeeklyHours(double weeklyHours) {
        this.weeklyHours = weeklyHours;
    }

    public double getTodayHours() {
        return todayHours;
    }

    public void setTodayHours(double todayHours) {
        this.todayHours = todayHours;
    }

    public long getTotalSessionsCount() {
        return totalSessionsCount;
    }

    public void setTotalSessionsCount(long totalSessionsCount) {
        this.totalSessionsCount = totalSessionsCount;
    }

    public long getTotalCompletedTasks() {
        return totalCompletedTasks;
    }

    public void setTotalCompletedTasks(long totalCompletedTasks) {
        this.totalCompletedTasks = totalCompletedTasks;
    }

    public long getTotalPendingTasks() {
        return totalPendingTasks;
    }

    public void setTotalPendingTasks(long totalPendingTasks) {
        this.totalPendingTasks = totalPendingTasks;
    }

    public double getTaskCompletionRate() {
        return taskCompletionRate;
    }

    public void setTaskCompletionRate(double taskCompletionRate) {
        this.taskCompletionRate = taskCompletionRate;
    }

    public List<DashboardStatsResponse.DailyStudyPoint> getLast30DaysChart() {
        return last30DaysChart;
    }

    public void setLast30DaysChart(List<DashboardStatsResponse.DailyStudyPoint> last30DaysChart) {
        this.last30DaysChart = last30DaysChart;
    }

    public List<DashboardStatsResponse.SubjectProgressPoint> getSubjectPerformance() {
        return subjectPerformance;
    }

    public void setSubjectPerformance(List<DashboardStatsResponse.SubjectProgressPoint> subjectPerformance) {
        this.subjectPerformance = subjectPerformance;
    }
}
