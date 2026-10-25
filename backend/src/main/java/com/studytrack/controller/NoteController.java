package com.studytrack.controller;

import com.studytrack.dto.ApiResponse;
import com.studytrack.dto.NoteRequest;
import com.studytrack.dto.NoteResponse;
import com.studytrack.service.NoteService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notes")
public class NoteController {

    private final NoteService noteService;

    public NoteController(NoteService noteService) {
        this.noteService = noteService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<NoteResponse>>> searchNotes(
        @RequestParam(required = false) Long subjectId,
        @RequestParam(required = false) String topic,
        @RequestParam(required = false) String search
    ) {
        List<NoteResponse> notes = noteService.searchNotes(subjectId, topic, search);
        return ResponseEntity.ok(ApiResponse.ok("Notes retrieved", notes));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<NoteResponse>> getNoteById(@PathVariable Long id) {
        NoteResponse response = noteService.getNoteById(id);
        return ResponseEntity.ok(ApiResponse.ok("Note retrieved", response));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<NoteResponse>> createNote(@Valid @RequestBody NoteRequest request) {
        NoteResponse response = noteService.createNote(request);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.ok("Note created successfully", response));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<NoteResponse>> updateNote(
        @PathVariable Long id,
        @Valid @RequestBody NoteRequest request
    ) {
        NoteResponse response = noteService.updateNote(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Note updated successfully", response));
    }

    @PatchMapping("/{id}/pin")
    public ResponseEntity<ApiResponse<NoteResponse>> togglePin(@PathVariable Long id) {
        NoteResponse response = noteService.togglePin(id);
        return ResponseEntity.ok(ApiResponse.ok("Note pin status updated", response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteNote(@PathVariable Long id) {
        noteService.deleteNote(id);
        return ResponseEntity.ok(ApiResponse.ok("Note deleted successfully", null));
    }
}
