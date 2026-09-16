package com.app.doubtconnect.service;

import com.app.doubtconnect.dto.DoubtDTO;
import com.app.doubtconnect.dto.DoubtResponse;
import com.app.doubtconnect.model.Doubt;
import com.app.doubtconnect.model.User;
import com.app.doubtconnect.repository.DoubtRepository;
import com.app.doubtconnect.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class DoubtService {

    private final DoubtRepository doubtRepository;
    private final UserRepository userRepository;

    private String getUsername() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth.getName();
    }

    public DoubtResponse postDoubt(DoubtDTO payload) {

        User user = userRepository.findByUsername(getUsername())
                .orElseThrow(() -> new RuntimeException("Unauthenticated user"));

        Doubt doubt = new Doubt();
        doubt.setTitle(payload.getTitle());
        doubt.setDescription(payload.getDescription());
        doubt.setUser(user);

        return DoubtResponse.from(doubtRepository.save(doubt));
    }

    public List<DoubtResponse> postDoubts(List<DoubtDTO> payloads) {

        User user = userRepository.findByUsername(getUsername())
                .orElseThrow(() -> new RuntimeException("Unauthenticated user"));

        List<Doubt> doubts = payloads.stream()
                .map(dto -> {
                    Doubt d = new Doubt();
                    d.setTitle(dto.getTitle());
                    d.setDescription(dto.getDescription());
                    d.setUser(user);
                    return d;
                })
                .toList();

        return doubtRepository.saveAll(doubts)
                .stream()
                .map(DoubtResponse::from)
                .toList();
    }

    public DoubtResponse getDoubt(Long id) {
        Doubt doubt = doubtRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Doubt not found"));
        return DoubtResponse.from(doubt);
    }

    public List<DoubtResponse> getFeed() {
        return doubtRepository.findByUserUsernameNot(getUsername())
                .stream()
                .map(DoubtResponse::from)
                .toList();
    }

    public List<DoubtResponse> getMyDoubts() {
        return doubtRepository.findByUserUsername(getUsername())
                .stream()
                .map(DoubtResponse::from)
                .toList();
    }
}
