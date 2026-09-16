package com.app.doubtconnect.dto;


import com.app.doubtconnect.model.User;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserResponse {
    private String username;
    private String firstName;
    private String lastName;

    public static UserResponse from(User user) {
        return UserResponse.builder()
                .username(user.getUsername())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .build();
    }
}
