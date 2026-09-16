package com.app.doubtconnect.dto;

public class DoubtDTO {
    private String title;
    private String description;


    public DoubtDTO() {
    }

    public DoubtDTO(String title, String description) {
        this.title = title;
        this.description = description;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
