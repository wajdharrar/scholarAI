package com.research.paper.impl.user;

import com.research.paper.dto.mapper.UserMapper;
import com.research.paper.dto.request.user.AuthenticationRequest;
import com.research.paper.dto.request.user.RefreshRequest;
import com.research.paper.dto.request.user.RegistrationRequest;
import com.research.paper.dto.response.AuthenticationResponse;
import com.research.paper.entity.user.Domains;
import com.research.paper.enumeration.ErrorCode;
import com.research.paper.exception.BusinessException;
import com.research.paper.entity.user.Role;
import com.research.paper.entity.user.User;
import com.research.paper.repository.User.DomainRepository;
import com.research.paper.repository.User.RoleRepository;
import com.research.paper.repository.User.UserRepository;
import com.research.paper.security.JwtService;
import com.research.paper.service.user.AuthenticationService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import static com.research.paper.enumeration.ErrorCode.EMAIL_ALREADY_EXISTS;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthenticationServiceImpl implements AuthenticationService {
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final DomainRepository domainRepository;
    private final UserMapper userMapper;
    @Override
    public AuthenticationResponse login(AuthenticationRequest request) {
        final Authentication auth = this.authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        final User user = (User) auth.getPrincipal();
        assert user != null;
        final String token = this.jwtService.generateAccessToken(user.getUsername());
        final String refreshToken = this.jwtService.generateRefreshToken(user.getUsername());
        final String tokenType = "Bearer";
        return AuthenticationResponse.builder()
                                        .accessToken(token)
                                        .refreshToken(refreshToken)
                                        .tokenType(tokenType)
                                        .build();
    }

    @Override
    @Transactional
    public void register(RegistrationRequest request) {
        checkUserEmail(request.getEmail());
        checkPasswords(request.getPassword(),request.getConfirmPassword());
        final Role userRole = this.roleRepository.findByName("ROLE_USER")
                .orElseThrow(()-> new EntityNotFoundException("Role user does not exists"));
        final List<Role> roles = new ArrayList<>();
        roles.add(userRole);
        Set<String> domainNames = request.getDomain();
        List<Domains> domains = new ArrayList<>();
        domainNames.forEach(domainName -> domains.add(this.domainRepository.findByName(domainName)
                .orElseThrow(()->new BusinessException(ErrorCode.DOMAIN_NOT_FOUND,domainName))));
        final User user = this.userMapper.toUser(request);
        user.setRoles(roles);
        user.setDomains(domains);
        log.debug("Saving user {}",user);
        this.userRepository.save(user);
        final List<User> users = new ArrayList<>();
        users.add(user);
        userRole.setUsers(users);
        this.roleRepository.save(userRole);

    }
    @Override
    public AuthenticationResponse refreshToken(RefreshRequest request) {
        final String newAccessToken = this.jwtService.refreshAccessToken(request.getRefreshToken());
        final String tokenType = "Bearer";
        return AuthenticationResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(request.getRefreshToken())
                .tokenType(tokenType)
                .build();
    }
    private void checkPasswords(String password, String confirmPassword) {
        if(password == null || !password.equals(confirmPassword)){
            throw new BusinessException(ErrorCode.PASSWORD_MISMATCH);
        }
    }

    private void checkUserEmail(String email) {
        final boolean exists = this.userRepository.existsByEmailIgnoreCase(email);
        if(exists){
            throw new BusinessException(EMAIL_ALREADY_EXISTS);
        }
    }

}
