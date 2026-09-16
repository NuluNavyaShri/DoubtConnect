package com.app.doubtconnect.service;

import com.app.doubtconnect.dto.UserStatsResponse;
import com.app.doubtconnect.model.Answer;
import com.app.doubtconnect.model.Doubt;
import com.app.doubtconnect.model.User;
import com.app.doubtconnect.repository.AnswerRepository;
import com.app.doubtconnect.repository.DoubtRepository;
import com.app.doubtconnect.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserStatsService {

    private final UserRepository userRepository;
    private final DoubtRepository doubtRepository;
    private final AnswerRepository answerRepository;

    public UserStatsResponse getUserStats() {

        String username = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Doubt> doubts = doubtRepository.findByUserUsername(username);
        List<Answer> answers = answerRepository.findByUserUsername(username);

        return UserStatsResponse.from(user, doubts, answers);
    }
}
