package com.studytrack.service.impl;

import com.studytrack.dto.*;
import com.studytrack.entity.*;
import com.studytrack.repository.*;
import com.studytrack.security.SecurityUtils;
import com.studytrack.service.DashboardService;
import com.studytrack.service.StudentService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.TextStyle;
import java.time.temporal.TemporalAdjusters;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DashboardServiceImpl implements DashboardService {

    private final StudentService studentService;
    private final SubjectRepository subjectRepository;
    private final TaskRepository taskRepository;
    private final ExamRepository examRepository;
    private final TimetableSessionRepository timetableSessionRepository;
    private final StudySessionRepository studySessionRepository;

    public DashboardServiceImpl(
        StudentService studentService,
        SubjectRepository subjectRepository,
        TaskRepository taskRepository,
        ExamRepository examRepository,
        TimetableSessionRepository timetableSessionRepository,
        StudySessionRepository studySessionRepository
    ) {
        this.studentService = studentService;
        this.subjectRepository = subjectRepository;
        this.taskRepository = taskRepository;
        this.examRepository = examRepository;
        this.timetableSessionRepository = timetableSessionRepository;
        this.studySessionRepository = studySessionRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public DashboardStatsResponse getDashboardStats() {
        Student student = studentService.getAuthenticatedStudentEntity();
        Long studentId = student.getId();
        LocalDate today = LocalDate.now();

        DashboardStatsResponse response = new DashboardStatsResponse();

        // 1. Basic counts
        List<Subject> subjects = subjectRepository.findByStudentIdOrderByNameAsc(studentId);
        response.setTotalSubjects(subjects.size());

        long completedTasks = taskRepository.countByStudentIdAndStatus(studentId, TaskStatus.COMPLETED);
        long totalTasks = taskRepository.countByStudentId(studentId);
        response.setTasksCompleted(completedTasks);
        response.setPendingTasks(totalTasks - completedTasks);

        response.setUpcomingExamsCount(examRepository.countUpcomingExams(studentId, LocalDateTime.now()));

        // 2. Study hours
        Integer todayMinutes = studySessionRepository.getTotalMinutesForDate(studentId, today);
        response.setTodayStudyHours(roundHours(todayMinutes));

        LocalDate monday = today.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
        LocalDate sunday = today.with(TemporalAdjusters.nextOrSame(DayOfWeek.SUNDAY));
        Integer weeklyMinutes = studySessionRepository.getTotalMinutesBetween(studentId, monday, sunday);
        double weekHours = roundHours(weeklyMinutes);
        response.setWeeklyStudyHours(weekHours);

        int targetWeekly = student.getTargetWeeklyHours() != null ? student.getTargetWeeklyHours() : 20;
        response.setTargetWeeklyHours(targetWeekly);
        int weeklyPct = targetWeekly > 0 ? (int) Math.round((weekHours / targetWeekly) * 100) : 0;
        response.setWeeklyProgressPercentage(Math.min(100, weeklyPct));

        // 3. Weekly study chart (Monday to Sunday)
        List<DashboardStatsResponse.DailyStudyPoint> weeklyChart = new ArrayList<>();
        LocalDate curr = monday;
        while (!curr.isAfter(sunday)) {
            Integer dayMins = studySessionRepository.getTotalMinutesForDate(studentId, curr);
            double dayHrs = roundHours(dayMins);
            String dayName = curr.getDayOfWeek().getDisplayName(TextStyle.SHORT, Locale.ENGLISH);
            weeklyChart.add(new DashboardStatsResponse.DailyStudyPoint(dayName, curr.toString(), dayHrs, dayMins != null ? dayMins : 0));
            curr = curr.plusDays(1);
        }
        response.setWeeklyStudyChart(weeklyChart);

        // 4. Subject-wise progress chart
        List<DashboardStatsResponse.SubjectProgressPoint> subjectPoints = buildSubjectProgressPoints(studentId, subjects);
        response.setSubjectProgressChart(subjectPoints);

        // 5. Today's Timetable
        List<TimetableSession> todaySessions = timetableSessionRepository.findByStudentIdAndSessionDateOrderByStartTimeAsc(studentId, today);
        response.setTodayTimetable(todaySessions.stream().map(TimetableSessionResponse::new).collect(Collectors.toList()));

        // 6. Upcoming deadlines (incomplete tasks ordered by deadline)
        List<Task> pendingTaskList = taskRepository.findFiltered(studentId, null, null, null).stream()
            .filter(t -> t.getStatus() != TaskStatus.COMPLETED && t.getDeadline() != null)
            .sorted(Comparator.comparing(Task::getDeadline))
            .limit(5)
            .collect(Collectors.toList());
        response.setUpcomingDeadlines(pendingTaskList.stream().map(TaskResponse::new).collect(Collectors.toList()));

        // 7. Upcoming Exams (next 4)
        List<Exam> upcomingExamList = examRepository.findUpcomingExams(studentId, LocalDateTime.now()).stream()
            .limit(4)
            .collect(Collectors.toList());
        response.setUpcomingExams(upcomingExamList.stream().map(ExamResponse::new).collect(Collectors.toList()));

        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public ProgressStatsResponse getProgressStats() {
        Long studentId = SecurityUtils.getCurrentStudentId();
        LocalDate today = LocalDate.now();

        ProgressStatsResponse stats = new ProgressStatsResponse();

        Integer allTimeMins = studySessionRepository.getTotalMinutesAllTime(studentId);
        stats.setAllTimeHours(roundHours(allTimeMins));

        LocalDate firstDayOfMonth = today.withDayOfMonth(1);
        LocalDate lastDayOfMonth = today.with(TemporalAdjusters.lastDayOfMonth());
        Integer monthlyMins = studySessionRepository.getTotalMinutesBetween(studentId, firstDayOfMonth, lastDayOfMonth);
        stats.setMonthlyHours(roundHours(monthlyMins));

        LocalDate monday = today.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
        LocalDate sunday = today.with(TemporalAdjusters.nextOrSame(DayOfWeek.SUNDAY));
        Integer weeklyMins = studySessionRepository.getTotalMinutesBetween(studentId, monday, sunday);
        stats.setWeeklyHours(roundHours(weeklyMins));

        Integer todayMins = studySessionRepository.getTotalMinutesForDate(studentId, today);
        stats.setTodayHours(roundHours(todayMins));

        List<StudySession> allSessions = studySessionRepository.findByStudentIdOrderBySessionDateDesc(studentId);
        stats.setTotalSessionsCount(allSessions.size());

        long completed = taskRepository.countByStudentIdAndStatus(studentId, TaskStatus.COMPLETED);
        long totalTasks = taskRepository.countByStudentId(studentId);
        stats.setTotalCompletedTasks(completed);
        stats.setTotalPendingTasks(totalTasks - completed);
        double completionRate = totalTasks > 0 ? Math.round(((double) completed / totalTasks) * 100.0) : 0.0;
        stats.setTaskCompletionRate(completionRate);

        // 30 days chart
        List<DashboardStatsResponse.DailyStudyPoint> last30Days = new ArrayList<>();
        LocalDate start30 = today.minusDays(29);
        LocalDate runner = start30;
        while (!runner.isAfter(today)) {
            Integer m = studySessionRepository.getTotalMinutesForDate(studentId, runner);
            double h = roundHours(m);
            String dayName = runner.getDayOfWeek().getDisplayName(TextStyle.SHORT, Locale.ENGLISH);
            last30Days.add(new DashboardStatsResponse.DailyStudyPoint(dayName, runner.toString(), h, m != null ? m : 0));
            runner = runner.plusDays(1);
        }
        stats.setLast30DaysChart(last30Days);

        // Subject performance
        List<Subject> subjects = subjectRepository.findByStudentIdOrderByNameAsc(studentId);
        stats.setSubjectPerformance(buildSubjectProgressPoints(studentId, subjects));

        return stats;
    }

    private List<DashboardStatsResponse.SubjectProgressPoint> buildSubjectProgressPoints(Long studentId, List<Subject> subjects) {
        List<DashboardStatsResponse.SubjectProgressPoint> list = new ArrayList<>();
        for (Subject subject : subjects) {
            Integer mins = studySessionRepository.getTotalMinutesForSubject(studentId, subject.getId());
            double loggedHours = roundHours(mins);
            double targetHours = subject.getTargetStudyHours() != null ? subject.getTargetStudyHours() : 30.0;

            int pct = targetHours > 0 ? (int) Math.round((loggedHours / targetHours) * 100) : 0;
            pct = Math.min(100, Math.max(0, pct));

            List<Task> subTasks = taskRepository.findByStudentIdAndSubjectId(studentId, subject.getId());
            long compTasks = subTasks.stream().filter(t -> t.getStatus() == TaskStatus.COMPLETED).count();

            list.add(new DashboardStatsResponse.SubjectProgressPoint(
                subject.getId(),
                subject.getName(),
                subject.getCode(),
                subject.getColor(),
                loggedHours,
                targetHours,
                pct,
                compTasks,
                (long) subTasks.size()
            ));
        }
        return list;
    }

    private double roundHours(Integer minutes) {
        if (minutes == null || minutes == 0) return 0.0;
        return Math.round((minutes / 60.0) * 10.0) / 10.0;
    }
}
