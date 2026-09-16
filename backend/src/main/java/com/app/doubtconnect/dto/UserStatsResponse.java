package com.app.doubtconnect.dto;

import com.app.doubtconnect.model.Answer;
import com.app.doubtconnect.model.Doubt;
import com.app.doubtconnect.model.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.stream.Collectors;

@Data
@Builder
public class UserStatsResponse {

    private UserResponse user;

    private int totalDoubts;
    private int totalAnswers;

    private List<DoubtResponse> doubts;
    private List<AnswerResponse> answers;

    public UserStatsResponse(UserResponse user, int totalDoubts, int totalAnswers, List<DoubtResponse> doubts, List<AnswerResponse> answers) {
        this.user = user;
        this.totalDoubts = totalDoubts;
        this.totalAnswers = totalAnswers;
        this.doubts = doubts;
        this.answers = answers;
    }

    public static UserStatsResponse from(
            User user,
            List<Doubt> doubts,
            List<Answer> answers
    ) {

        return UserStatsResponse.builder()
                .user(UserResponse.from(user))
                .totalDoubts(doubts.size())
                .totalAnswers(answers.size())
                .doubts(
                        doubts.stream()
                                .map(DoubtResponse::from)
                                .collect(Collectors.toList())
                )
                .answers(
                        answers.stream()
                                .map(AnswerResponse::from)
                                .collect(Collectors.toList())
                )
                .build();
    }
}
