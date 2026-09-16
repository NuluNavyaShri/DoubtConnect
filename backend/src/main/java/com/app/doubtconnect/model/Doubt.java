package com.app.doubtconnect.model;


import jakarta.persistence.*;

import java.util.List;


//@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Entity
public class Doubt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long doubtId;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "asked_by", referencedColumnName = "username", nullable = false)
    private User user;


    @OneToMany(
            mappedBy = "doubt",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<Answer> answers;


    public Doubt() {
    }

    public Doubt(Long doubtId, String title, String description, User user, List<Answer> answers) {
        this.doubtId = doubtId;
        this.title = title;
        this.description = description;
        this.user = user;
        this.answers = answers;
    }

    public Doubt(Long doubtId, String title, String description, User user ) {
        this.doubtId = doubtId;
        this.title = title;
        this.description = description;
        this.user = user;
    }

    public Long getDoubtId() {
        return doubtId;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public User getUser() {
        return user;
    }

    public List<Answer> getAnswers() {
        return answers;
    }

    public void setDoubtId(Long doubtId) {
        this.doubtId = doubtId;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public void setAnswers(List<Answer> answers) {
        this.answers = answers;
    }

    @Override
    public String toString() {
        return "Doubt [doubtId=" + doubtId + ", title=" + title
                + ", description=" + description + ", user=" + user + ", answers=" + answers + "]";

    }
}
