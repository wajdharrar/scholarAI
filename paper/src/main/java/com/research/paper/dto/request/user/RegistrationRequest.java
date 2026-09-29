package com.research.paper.dto.request.user;

import com.research.paper.validation.NonDisposableEmail;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegistrationRequest {
    @NotBlank(message = "VALIDATION.REGISTRATION.LASTNAME.NOT_BLANK")
    @Size(min = 1 , max = 50 , message = "VALIDATION.REGISTRATION.LASTNAME.SIZE")
    @Pattern(regexp = "^[a-zA-Z]+$" , message = "VALIDATION.REGISTRATION.LASTNAME.PATTERN")
    @Schema(example = "Last name")
    private String lastName;
    @NotBlank(message = "VALIDATION.REGISTRATION.FIRSTNAME.NOT_BLANK")
    @Size(min = 1 , max = 50 , message = "VALIDATION.REGISTRATION.FIRSTNAME.SIZE")
    @Pattern(regexp = "^[a-zA-Z]+$" , message = "VALIDATION.REGISTRATION.FIRSTNAME.PATTERN")
    @Schema(example = "Name")
    private String firstName;
    @NotBlank(message = "VALIDATION.REGISTRATION.EMAIL.NOT_BLANK")
    @Email(message = "VALIDATION.REGISTRATION.EMAIL.FORMAT")
    @Schema(example = "name@mail.com")
    @NonDisposableEmail(message = "VALIDATION.REGISTRATION.EMAIL.DISPOSABLE")
    private String email;
    @NotBlank(message = "VALIDATION.REGISTRATION.PASSWORD.NOT_BLANK")
    @Size(min = 8 , max = 50 , message = "VALIDATION.REGISTRATION.PASSWORD.SIZE")
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$" , message = "VALIDATION.REGISTRATION.PASSWORD.PATTERN")
    @Schema(example = "G1impse$tuff74Prize8Koala!")
    private String password;
    @NotBlank(message = "VALIDATION.REGISTRATION.CONFIRM_PASSWORD.NOT_BLANK")
    @Size(min = 8 , max = 50 , message = "VALIDATION.REGISTRATION.CONFIRM_PASSWORD.SIZE")
    @Schema(example = "G1impse$tuff74Prize8Koala!")
    private String confirmPassword;
    @NotBlank(message = "VALIDATION.REGISTRATION.INSTITUTION.NOT_BLANK")
    @Size(min = 1 , max = 50 , message = "VALIDATION.REGISTRATION.INSTITUTION.SIZE")
    @Pattern(regexp = "^[a-zA-Z]+$" , message = "VALIDATION.REGISTRATION.INSTITUTION.PATTERN")
    @Schema(example = "ISI")
    private String institution;
    @NotBlank(message = "VALIDATION.REGISTRATION.COUNTRY.NOT_BLANK")
    @Size(min = 1 , max = 20 , message = "VALIDATION.REGISTRATION.COUNTRY.SIZE")
    @Pattern(regexp = "^[a-zA-Z]+$" , message = "VALIDATION.REGISTRATION.COUNTRY.PATTERN")
    @Schema(example = "TUNISIA")
    private String country;
    @Schema(example = "https://bootdey.com/img/Content/avatar/avatar1.png")
    private String imageUrl;
    @Schema(example = "[\"Artificial Intelligence\"]")
    private Set<String> domain = new HashSet<>();
}
