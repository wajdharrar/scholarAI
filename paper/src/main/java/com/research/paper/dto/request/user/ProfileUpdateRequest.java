package com.research.paper.dto.request.user;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProfileUpdateRequest {
    @Size(min = 1 , max = 50 , message = "VALIDATION.PROFILE_UPDATE.LASTNAME.SIZE")
    @Pattern(regexp = "^[a-zA-Z]+$" , message = "VALIDATION.PROFILE_UPDATE.LASTNAME.PATTERN")
    @Schema(example = "Last name")
    private String lastName;
    @Size(min = 1 , max = 50 , message = "VALIDATION.PROFILE_UPDATE.FIRSTNAME.SIZE")
    @Pattern(regexp = "^[a-zA-Z]+$" , message = "VALIDATION.PROFILE_UPDATE.FIRSTNAME.PATTERN")
    @Schema(example = "Name")
    private String firstName;
    @Size(min = 1 , max = 50 , message = "VALIDATION.PROFILE_UPDATE.INSTITUTION.SIZE")
    @Pattern(regexp = "^[a-zA-Z]+$" , message = "VALIDATION.PROFILE_UPDATE.INSTITUTION.PATTERN")
    @Schema(example = "ISI")
    private String institution;
    @Size(min = 1 , max = 20 , message = "VALIDATION.PROFILE_UPDATE.COUNTRY.SIZE")
    @Pattern(regexp = "^[a-zA-Z]+$" , message = "VALIDATION.PROFILE_UPDATE.COUNTRY.PATTERN")
    @Schema(example = "TUNISIA")
    private String country;
    @Size(max = 255000)
    private String imageUrl;
}
