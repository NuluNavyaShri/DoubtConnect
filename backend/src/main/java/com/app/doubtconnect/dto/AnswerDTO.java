package com.app.doubtconnect.dto;

public class AnswerDTO {
    private Long doubtId;
    private String content;

    public AnswerDTO() {
    }

    public AnswerDTO(String content) {
        this.content = content;
    }

    public Long getDoubtId() {
        return doubtId;
    }

    public void setDoubtId(Long doubtId) {
        this.doubtId = doubtId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    @Override
    public String toString() {
        return "AnswerDTO [content=" + content + "]";
    }
}
