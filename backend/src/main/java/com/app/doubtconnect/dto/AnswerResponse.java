package com.app.doubtconnect.dto;

import com.app.doubtconnect.model.Answer;
import lombok.Builder;
import lombok.Data;


@Data
@Builder
public class AnswerResponse {
    private Long answerId;
    private String content;
    private DoubtResponse doubtResponse;
    private UserResponse userResponse;



    public static AnswerResponse from(Answer answer) {
        // return new AnswerResponse(answer.getAnswerId(), answer.getContent(), DoubtResponse.from(answer.getDoubt()), answer.getUser());

        return AnswerResponse.builder()
                .answerId(answer.getAnswerId())
                .content(answer.getContent())
                .doubtResponse(DoubtResponse.from(answer.getDoubt()))
                .userResponse(UserResponse.from(answer.getUser()))
                .build();
    }
}


