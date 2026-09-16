package com.app.doubtconnect.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.app.doubtconnect.model.User;
import org.springframework.stereotype.Repository;

public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByUsername(String username);
}
