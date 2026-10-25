package com.studytrack.dto;

import java.util.List;

public class DashboardStatsResponse {

    private long totalSubjects;
    private long tasksCompleted;
    private long pendingTasks;
    private long upcomingExamsCount;
    private double todayStudyHours;
    private double weeklyStudyHours;
    private int targetWeeklyHours;
    private double weeklyProgressPercentage;

    private List<DailyStudyPoint> weeklyStudyChart;
    private List<SubjectProgressPoint> subjectProgressChart;
    private List<TimetableSessionResponse> todayTimetable;
    private List<TaskResponse> upcomingDeadlines;
    private List<ExamResponse> upcomingExams;

    public DashboardStatsResponse() {
    }

    public static class DailyStudyPoint {
        private String day;       // e.g. "Mon", "Tue"
        private String date;      // e.g. "2026-10-24"
        private double hours;     // e.g. 2.5
        private int minutes;

        public DailyStudyPoint() {}

        public DailyStudyPoint(String day, String date, double hours, int minutes) {
            this.day = day;
            this.date = date;
            this.hours = hours;
            this.minutes = minutes;
        }

        public String getDay() { return day; }
        public void setDay(String day) { this.day = day; }
        public String getDate() { return date; }
        public void setDate(String date) { this.date = date; }
        public double getHours() { return hours; }
        public void setHours(double hours) { this.hours = hours; }
        public int getMinutes() { return minutes; }
        public void setMinutes(int minutes) { this.minutes = minutes; }
    }

    public static class SubjectProgressPoint {
        private Long subjectId;
        private String subjectName;
        private String subjectCode;
        private String color;
        private double loggedHours;
        private double targetHours;
        private int completionPercentage;
        private long completedTasks;
        private long totalTasks;

        public SubjectProgressPoint() {}

        public SubjectProgressPoint(Long subjectId, String subjectName, String subjectCode, String color, double loggedHours, double targetHours, int completionPercentage, long completedTasks, long totalTasks) {
            this.subjectId = subjectId;
            this.subjectName = subjectName;
            this.subjectCode = subjectCode;
            this.color = color;
            this.loggedHours = loggedHours;
            this.targetHours = targetHours;
            this.completionPercentage = completionPercentage;
            this.completedTasks = completedTasks;
            this.totalTasks = totalTasks;
        }

        public Long getSubjectId() { return subjectId; }
        public void setSubjectId(Long subjectId) { this.subjectId = subjectId; }
        public String getSubjectName() { return subjectName; }
        public void setSubjectName(String subjectName) { this.subjectName = subjectName; }
        public String getSubjectCode() { return subjectCode; }
        public void setSubjectCode(String subjectCode) { this.subjectCode = subjectCode; }
        public String getColor() { return color; }
        public void setColor(String color) { this.color = color; }
        public double getLoggedHours() { return loggedHours; }
        public void setLoggedHours(double loggedHours) { this.loggedHours = loggedHours; }
        public double getTargetHours() { return targetHours; }
        public void setTargetHours(double targetHours) { this.targetHours = targetHours; }
        public int getCompletionPercentage() { return completionPercentage; }
        public void setCompletionPercentage(int completionPercentage) { this.completionPercentage = completionPercentage; }
        public long getCompletedTasks() { return completedTasks; }
        public void setCompletedTasks(long completedTasks) { this.completedTasks = completedTasks; }
        public long getTotalTasks() { return totalTasks; }
        public void setTotalTasks(long totalTasks) { this.totalTasks = totalTasks; }
    }

    public long getTotalSubjects() { return totalSubjects; }
    public void setTotalSubjects(long totalSubjects) { this.totalSubjects = totalSubjects; }
    public long getTasksCompleted() { return tasksCompleted; }
    public void setTasksCompleted(long tasksCompleted) { this.tasksCompleted = tasksCompleted; }
    public long getPendingTasks() { return pendingTasks; }
    public void setPendingTasks(long pendingTasks) { this.pendingTasks = pendingTasks; }
    public long getUpcomingExamsCount() { return upcomingExamsCount; }
    public void setUpcomingExamsCount(long upcomingExamsCount) { this.upcomingExamsCount = upcomingExamsCount; }
    public double getTodayStudyHours() { return todayStudyHours; }
    public void setTodayStudyHours(double todayStudyHours) { this.todayStudyHours = todayStudyHours; }
    public double getWeeklyStudyHours() { return weeklyStudyHours; }
    public void setWeeklyStudyHours(double weeklyStudyHours) { this.weeklyStudyHours = weeklyStudyHours; }
    public int getTargetWeeklyHours() { return targetWeeklyHours; }
    public void setTargetWeeklyHours(int targetWeeklyHours) { this.targetWeeklyHours = targetWeeklyHours; }
    public double getWeeklyProgressPercentage() { return weeklyProgressPercentage; }
    public void setWeeklyProgressPercentage(double weeklyProgressPercentage) { this.weeklyProgressPercentage = weeklyProgressPercentage; }
    public List<DailyStudyPoint> getWeeklyStudyChart() { return weeklyStudyChart; }
    public void setWeeklyStudyChart(List<DailyStudyPoint> weeklyStudyChart) { this.weeklyStudyChart = weeklyStudyChart; }
    public List<SubjectProgressPoint> getSubjectProgressChart() { return subjectProgressChart; }
    public void setSubjectProgressChart(List<SubjectProgressPoint> subjectProgressChart) { this.subjectProgressChart = subjectProgressChart; }
    public List<TimetableSessionResponse> getTodayTimetable() { return todayTimetable; }
    public void setTodayTimetable(List<TimetableSessionResponse> todayTimetable) { this.todayTimetable = todayTimetable; }
    public List<TaskResponse> getUpcomingDeadlines() { return upcomingDeadlines; }
    public void setUpcomingDeadlines(List<TaskResponse> upcomingDeadlines) { this.upcomingDeadlines = upcomingDeadlines; }
    public List<ExamResponse> getUpcomingExams() { return upcomingExams; }
    public void setUpcomingExams(List<ExamResponse> upcomingExams) { this.upcomingExams = upcomingExams; }
}
