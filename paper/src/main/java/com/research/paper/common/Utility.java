package com.research.paper.common;

import com.research.paper.entity.user.User;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.util.Objects;
@Component
public class Utility {
    public String getUserId(final Authentication principal){
        return ((User) Objects.requireNonNull(principal.getPrincipal())).getId();
    }
}
