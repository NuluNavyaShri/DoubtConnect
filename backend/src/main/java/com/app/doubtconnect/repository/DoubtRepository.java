package com.app.doubtconnect.repository;


import com.app.doubtconnect.model.Doubt;
import com.app.doubtconnect.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DoubtRepository extends JpaRepository<Doubt, Long> {

    Optional<Doubt> findByDoubtId(Long doubtId);
    List<Doubt> findByUser(User user);

    List<Doubt> findByUserUsernameNot(String username);
    List<Doubt> findByUserUsername(String username);


}