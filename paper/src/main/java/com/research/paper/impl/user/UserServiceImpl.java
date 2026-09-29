package com.research.paper.impl.user;

import com.research.paper.dto.mapper.UserMapper;
import com.research.paper.dto.request.user.ChangePasswordRequest;
import com.research.paper.dto.request.user.ProfileUpdateRequest;
import com.research.paper.dto.request.user.UserSearchDto;
import com.research.paper.dto.response.UserResponse;
import com.research.paper.enumeration.ErrorCode;
import com.research.paper.exception.BusinessException;
import com.research.paper.entity.user.User;
import com.research.paper.repository.User.UserRepository;
import com.research.paper.service.user.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;
    @Override
    public UserDetails loadUserByUsername(String userEmail) throws UsernameNotFoundException {
        return this.userRepository.findByEmailIgnoreCase(userEmail)
                .orElseThrow(()->new UsernameNotFoundException("User not found with username : "+userEmail));
    }
    public void updateProfileInfo(ProfileUpdateRequest request, String userId){
        User  savedUser = this.userRepository.findById(userId)
                .orElseThrow(()->new BusinessException(ErrorCode.USER_NOT_FOUND,userId));
        this.userMapper.mergeUserInfo(savedUser,request);
        this.userRepository.save(savedUser);
    }
    public void changePassword(ChangePasswordRequest request, String userId){
        if(!request.getNewPassword().equals(request.getConfirmNewPassword())){
            throw new BusinessException(ErrorCode.CHANGE_PASSWORD_MISMATCH);
        }
        final User savedUser = this.userRepository.findById(userId)
                .orElseThrow(()-> new BusinessException(ErrorCode.USER_NOT_FOUND));
        if(!this.passwordEncoder.matches(request.getCurrentPassword(), savedUser.getPassword())){
            throw new BusinessException(ErrorCode.INVALID_CURRENT_PASSWORD);
        }
        savedUser.setPassword(this.passwordEncoder.encode(request.getNewPassword()));
        this.userRepository.save(savedUser);
    }
    public void deactivateAccount(String userId){
        final User user = this.userRepository.findById(userId)
                .orElseThrow(()-> new BusinessException(ErrorCode.USER_NOT_FOUND));
        if(!user.isEnabled()){
            throw new BusinessException(ErrorCode.ACCOUNT_ALREADY_DEACTIVATED);
        }
        user.setEnabled(false);
        this.userRepository.save(user);
    }
    public void reactivateAccount(String userId){
        final User user = this.userRepository.findById(userId)
                .orElseThrow(()-> new BusinessException(ErrorCode.USER_NOT_FOUND));
        if(user.isEnabled()){
            throw new BusinessException(ErrorCode.ACCOUNT_ALREADY_ACTIVATED);
        }
        user.setEnabled(true);
        this.userRepository.save(user);
    }
    public UserResponse getUserById(String id){
        User user = this.userRepository.findById(id).orElseThrow(()->new BusinessException(ErrorCode.USER_NOT_FOUND));
        return this.userMapper.toUserResponse(user);
    }
    @Override
    public List<UserSearchDto> searchUsers(String query) {
        return userRepository.searchUsers(query)
                .stream()
                .limit(5)
                .map(u -> new UserSearchDto(
                        u.getId(),
                        u.getFirstname() + " " + u.getLastname(),
                        u.getEmail()
                ))
                .toList();
    }
    @Override
    public List<UserResponse> getAllUsers(){
        List<User> users = this.userRepository.findAll();
        return users.stream()
                .map(this.userMapper::toUserResponse) // Added 'user ->'
                .collect(Collectors.toList());
    }

    public void deleteAccount(String userId){
        // this method needs the rest of the entities
        // the logic is just to schedule a profile for deletion
        // and then a scheduled job will pick the profiles and delete everything
    }


}
