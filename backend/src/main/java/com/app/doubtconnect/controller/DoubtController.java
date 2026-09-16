package com.app.doubtconnect.controller;

import com.app.doubtconnect.dto.DoubtDTO;
import com.app.doubtconnect.dto.DoubtResponse;
import com.app.doubtconnect.service.DoubtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doubts")
@RequiredArgsConstructor
public class DoubtController {

    private final DoubtService doubtService;

    @PostMapping("/post")
    public ResponseEntity<DoubtResponse> postDoubt(@RequestBody DoubtDTO payload) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(doubtService.postDoubt(payload));
    }

    @PostMapping("/postAll")
    public ResponseEntity<List<DoubtResponse>> postDoubts(@RequestBody List<DoubtDTO> payload) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(doubtService.postDoubts(payload));
    }

    @GetMapping("/{id}")
    public ResponseEntity<DoubtResponse> getDoubt(@PathVariable Long id) {
        return ResponseEntity.ok(doubtService.getDoubt(id));
    }

    @GetMapping("/feed")
    public ResponseEntity<List<DoubtResponse>> getFeed() {
        return ResponseEntity.ok(doubtService.getFeed());
    }

    @GetMapping("/me")
    public ResponseEntity<List<DoubtResponse>> getMyDoubts() {
        return ResponseEntity.ok(doubtService.getMyDoubts());
    }
}
