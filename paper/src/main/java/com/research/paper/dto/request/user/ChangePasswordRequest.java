package com.research.paper.dto.request.user;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;

@Getter
public class ChangePasswordRequest {
    @NotBlank(message = "VALIDATION.CHANGE_PASSWORD.CURRENT_PASSWORD.NOT_BLANK")
    @Size(min = 8 , max = 50 , message = "VALIDATION.CHANGE_PASSWORD.CURRENT_PASSWORD.SIZE")
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$" , message = "VALIDATION.CHANGE_PASSWORD.CURRENT_PASSWORD.PATTERN")
    @Schema(example = "G1impse$tuff74Prize8Koala!")
    private String currentPassword;
    @NotBlank(message = "VALIDATION.CHANGE_PASSWORD.NEW_PASSWORD.NOT_BLANK")
    @Size(min = 8 , max = 50 , message = "VALIDATION.CHANGE_PASSWORD.NEW_PASSWORD.SIZE")
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$" , message = "VALIDATION.CHANGE_PASSWORD.NEW_PASSWORD.PATTERN")
    private String newPassword;
    @NotBlank(message = "VALIDATION.CHANGE_PASSWORD.CONFIRM_NEW_PASSWORD.NOT_BLANK")
    @Size(min = 8 , max = 50 , message = "VALIDATION.CHANGE_PASSWORD.CONFIRM_NEW_PASSWORD.SIZE")
    private String confirmNewPassword;
}
