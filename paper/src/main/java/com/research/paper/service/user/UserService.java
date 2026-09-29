package com.research.paper.service.user;

import com.research.paper.dto.request.user.ChangePasswordRequest;
import com.research.paper.dto.request.user.ProfileUpdateRequest;
import com.research.paper.dto.request.user.UserSearchDto;
import com.research.paper.dto.response.UserResponse;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.util.List;

public interface UserService extends UserDetailsService {
    void updateProfileInfo(ProfileUpdateRequest request,String userId);
    void changePassword(ChangePasswordRequest request,String userId);
    void deactivateAccount(String userId);
    void reactivateAccount(String userId);
    void deleteAccount(String userId);
    UserResponse getUserById(String id);
    List<UserSearchDto> searchUsers(String query);
    List<UserResponse> getAllUsers();

}
