package com.app.doubtconnect.dto;

import com.app.doubtconnect.model.Doubt;
import com.app.doubtconnect.model.User;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class DoubtResponse {

    public static class Triplet {
        Long commentId;
        String username;
        String content;

        public Triplet(Long commentId, String username, String content) {
            this.commentId = commentId;
            this.username = username;
            this.content = content;
        }

        public String getUsername() {
            return username;
        }

        public String getContent() {
            return content;
        }

        public Long getCommentId() {
            return commentId;
        }
    }


    private Long id;
    private String title;
    private String description;
    private UserResponse userResponse;
    private List<Triplet> answers;



    public static DoubtResponse from(Doubt doubt) {
        return DoubtResponse.builder()
                .id(doubt.getDoubtId())
                .title(doubt.getTitle())
                .description(doubt.getDescription())
                .userResponse(UserResponse.from(doubt.getUser()))
                .answers(
                        doubt.getAnswers() == null
                                ? List.of()
                                : doubt.getAnswers()
                                .stream()
                                .map(a -> new Triplet(
                                        a.getAnswerId(),
                                        a.getUser().getUsername(),
                                        a.getContent()
                                ))
                                .toList()
                )
                .build();
    }
}
