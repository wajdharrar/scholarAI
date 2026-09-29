package com.research.paper.dto.request.user;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RefreshRequest {
    @NotBlank(message = "VALIDATION.REFRESH_REQUEST.REFRESH_TOKEN.NOT_BLANK")
    private String refreshToken;
}
