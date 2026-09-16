package com.app.doubtconnect.repository;

import java.util.List;
import java.util.Optional;

import com.app.doubtconnect.model.Answer;
import com.app.doubtconnect.model.Doubt;
import com.app.doubtconnect.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AnswerRepository extends JpaRepository<Answer, Long> {
    Optional<Answer> findByAnswerId(Long id);
    List<Answer> findByDoubt(Doubt doubt);
    List<Answer> findByDoubtDoubtId(Long id);
    List<Answer> findByUserUsername(String username);
    List<Answer> findByUser(User user);
}
