package com.app.doubtconnect.controller;

import com.app.doubtconnect.dto.UserStatsResponse;
import com.app.doubtconnect.service.UserStatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user/stats")
public class UserStatsController {

    @Autowired
    private UserStatsService userStatsService;

    @GetMapping
    public ResponseEntity<UserStatsResponse> getUserStats() {
        return ResponseEntity.ok(userStatsService.getUserStats());
    }
}
