package com.research.paper.service.user;

import com.research.paper.dto.request.user.AuthenticationRequest;
import com.research.paper.dto.request.user.RefreshRequest;
import com.research.paper.dto.request.user.RegistrationRequest;
import com.research.paper.dto.response.AuthenticationResponse;

public interface AuthenticationService {
    AuthenticationResponse login(AuthenticationRequest request);
    void register(RegistrationRequest request);
    AuthenticationResponse refreshToken(final RefreshRequest request);
}
