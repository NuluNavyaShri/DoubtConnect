package com.app.doubtconnect.controller;

import com.app.doubtconnect.dto.AnswerDTO;
import com.app.doubtconnect.dto.AnswerResponse;
import com.app.doubtconnect.model.Answer;
import com.app.doubtconnect.service.AnswerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/answer")
@RequiredArgsConstructor
public class AnswerController {

    private final AnswerService answerService;

    @PostMapping("/comment")
    public ResponseEntity<AnswerResponse> postComment(@RequestBody AnswerDTO payload) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(answerService.postComment(payload));
    }

    @GetMapping("/comment/{id}")
    public ResponseEntity<AnswerResponse> getComment(@PathVariable Long id) {
        return ResponseEntity.ok(answerService.getComment(id));
    }

    @DeleteMapping("/comment/{id}")
    public ResponseEntity<AnswerResponse> deleteComment(@PathVariable Long id) {
        return ResponseEntity.ok(answerService.deleteComment(id));
    }

    @PutMapping("/comment/{id}")
    public ResponseEntity<AnswerResponse> updateComment(
            @PathVariable Long id,
            @RequestBody AnswerDTO payload
    ) {
        return ResponseEntity.ok(answerService.updateComment(id, payload));
    }

    @GetMapping("/allComments")
    public ResponseEntity<?> getAllComments() {
        return ResponseEntity.ok(answerService.getAllComments());
    }

    @GetMapping("/comments/me")
    public ResponseEntity<?> getCommentsMe() {
        return ResponseEntity.ok(answerService.getCommentsMe());
    }

    @GetMapping("/comments/{id}")
    public ResponseEntity<?> getCommentsByDoubtId(@PathVariable Long id) {
        return ResponseEntity.ok(answerService.getCommentsByDoubtId(id));
    }
}
