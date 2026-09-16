package com.app.doubtconnect.service;

import com.app.doubtconnect.dto.AnswerDTO;
import com.app.doubtconnect.dto.AnswerResponse;
import com.app.doubtconnect.model.Answer;
import com.app.doubtconnect.model.Doubt;
import com.app.doubtconnect.model.User;
import com.app.doubtconnect.repository.AnswerRepository;
import com.app.doubtconnect.repository.DoubtRepository;
import com.app.doubtconnect.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class AnswerService {

    private final AnswerRepository answerRepository;
    private final DoubtRepository doubtRepository;
    private final UserRepository userRepository;

    private String getUsername() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth.getName();
    }

    public AnswerResponse postComment(AnswerDTO dto) {

        User user = userRepository.findByUsername(getUsername())
                .orElseThrow(() -> new RuntimeException("Unauthenticated user"));

        Doubt doubt = doubtRepository.findById(dto.getDoubtId())
                .orElseThrow(() -> new RuntimeException("Doubt not found"));

        Answer answer = new Answer();
        answer.setContent(dto.getContent());
        answer.setDoubt(doubt);
        answer.setUser(user);

        return AnswerResponse.from(answerRepository.save(answer));
    }

    public AnswerResponse getComment(Long id) {
        Answer answer = answerRepository.findByAnswerId(id)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        return AnswerResponse.from(answer);
    }

    public AnswerResponse deleteComment(Long id) {

        Answer answer = answerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        Doubt doubt = answer.getDoubt();

        doubt.getAnswers().remove(answer);

        return AnswerResponse.from(answer);

    }

    public AnswerResponse updateComment(Long id, AnswerDTO dto) {

        Answer answer = answerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        answer.setContent(dto.getContent());
        answerRepository.save(answer);

        return AnswerResponse.from(answer);
    }

    public List<AnswerResponse> getAllComments() {
        return answerRepository.findAll().stream().map(AnswerResponse::from).toList();
    }

    public List<AnswerResponse> getCommentsMe() {
        return answerRepository.findByUserUsername(getUsername()).stream().map(AnswerResponse::from).toList();
    }

    public List<AnswerResponse> getCommentsByDoubtId(Long id) {
        return answerRepository.findByDoubtDoubtId(id).stream().map(AnswerResponse::from).toList();
    }
}
