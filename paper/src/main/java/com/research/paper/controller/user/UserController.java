package com.research.paper.controller.user;

import com.research.paper.dto.request.user.AuthenticationRequest;
import com.research.paper.dto.request.user.ChangePasswordRequest;
import com.research.paper.dto.request.user.ProfileUpdateRequest;
import com.research.paper.dto.request.user.UserSearchDto;
import com.research.paper.dto.response.AuthenticationResponse;
import com.research.paper.dto.response.UserResponse;
import com.research.paper.entity.user.User;
import com.research.paper.service.user.UserService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@Tag(name = "User",description = "User API")
public class UserController {
    private final UserService userService;
    @PatchMapping("/me")
    @ResponseStatus(code = HttpStatus.NO_CONTENT)
    public void updateProfileInfo(
            @RequestBody
            @Valid
            ProfileUpdateRequest request,
            final Authentication principal){
        this.userService.updateProfileInfo(request, getUserId(principal));
    }
    @GetMapping("/user")
    public ResponseEntity<UserResponse> getCurrentUser(
            final Authentication principal
    ){
        return ResponseEntity.ok(this.userService.getUserById(getUserId(principal)));
    }
    private String getUserId(final Authentication principal){
        return ((User) Objects.requireNonNull(principal.getPrincipal())).getId();
    }
    @PostMapping("/me/password")
    @ResponseStatus(code = HttpStatus.NO_CONTENT)
    public void changePassword(
            @RequestBody
            @Valid
            ChangePasswordRequest request,
            Authentication principal){
        this.userService.changePassword(request,getUserId(principal));

    }
    @PatchMapping("/me/deactivate")
    @ResponseStatus(code = HttpStatus.NO_CONTENT)
    public void deactivateAccount(final Authentication principal){
        this.userService.deactivateAccount(getUserId(principal));
    }
    @PatchMapping("/me/reactivate")
    @ResponseStatus(code = HttpStatus.NO_CONTENT)
    public void reactivateAccount(final Authentication principal){
        this.userService.reactivateAccount(getUserId(principal));
    }
    @DeleteMapping("/me")
    @ResponseStatus(code = HttpStatus.NO_CONTENT)
    public void deleteAccount(final Authentication principal){
        this.userService.deleteAccount(getUserId(principal));
    }
    @GetMapping("/search")
    public ResponseEntity<List<UserSearchDto>> searchUsers(@RequestParam String q) {
        return ResponseEntity.ok(userService.searchUsers(q));
    }
    @GetMapping("")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    }
