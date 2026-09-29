package com.research.paper.dto.mapper;

import com.research.paper.dto.request.user.ProfileUpdateRequest;
import com.research.paper.dto.request.user.RegistrationRequest;
import com.research.paper.dto.response.UserResponse;
import com.research.paper.entity.user.User;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UserMapper {
    private final PasswordEncoder passwordEncoder;
    public void mergeUserInfo(User user, ProfileUpdateRequest request) {
        if (StringUtils.isNotBlank(request.getFirstName())
                && !user.getFirstname().equals(request.getFirstName())) {
            user.setFirstname(request.getFirstName());
        }
        if (StringUtils.isNotBlank(request.getLastName())
                && !user.getLastname().equals(request.getLastName())) {
            user.setLastname(request.getLastName());
        }
        if (StringUtils.isNotBlank(request.getInstitution())
                && !user.getInstitution().equals(request.getInstitution())) {
            user.setInstitution(request.getInstitution());
        }
        if (StringUtils.isNotBlank(request.getCountry())
                && !user.getCountry().equals(request.getCountry())) {
            user.setCountry(request.getCountry());
        }
        if (StringUtils.isNotBlank(request.getImageUrl())
                && !user.getImageUrl().equals(request.getImageUrl())) {
            user.setCountry(request.getImageUrl());
        }
    }

    public User toUser(RegistrationRequest request) {
        return User.builder()
                .firstname(request.getFirstName())
                .lastname(request.getLastName())
                .country(request.getCountry())
                .institution(request.getInstitution())
                .email(request.getEmail())
                .imageUrl(request.getImageUrl())
                .password(passwordEncoder.encode(request.getPassword()))
                .enabled(true)
                .locked(false)
                .credentialsExpired(false)
                .emailVerified(false)
                .citationCount(0)
                .papersCount(0)
                .build();
    }
    public UserResponse toUserResponse(User user){
        return UserResponse.builder()
                .id(user.getId())
                .firstName(user.getFirstname())
                .lastName(user.getLastname())
                .country(user.getCountry())
                .institution(user.getInstitution())
                .imageUrl(user.getImageUrl())
                .papersCount(user.getPapersCount())
                .citationCount(user.getCitationCount())
                .createdAt(user.getCreatedDate())
                .email(user.getEmail())
                .bio(user.getBio())
                .build();
    }
}
