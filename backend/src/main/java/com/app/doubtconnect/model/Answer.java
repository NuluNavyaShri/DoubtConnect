package com.app.doubtconnect.model;


import jakarta.persistence.*;

@Entity
public class Answer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long answerId;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "doubt_id", nullable = false)
    private Doubt doubt;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(
            name = "answered_by",
            referencedColumnName = "username",
            nullable = false
    )
    private User user;

    public Long getAnswerId() {
        return answerId;
    }

    public void setAnswerId(Long answerId) {
        this.answerId = answerId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Doubt getDoubt() {
        return doubt;
    }

    public void setDoubt(Doubt doubt) {
        this.doubt = doubt;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
