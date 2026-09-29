package com.research.paper.dto.request.user;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DomainCreationRequest {
    @NotBlank(message = "VALIDATION.DOMAIN_UPDATE.NAME.NOT_BLANK")
    @Size(min = 10, max = 50, message = "VALIDATION.DOMAIN_UPDATE.NAME.SIZE")
    @Schema(example = "Computer Science")
    private String name;
    @NotBlank(message = "VALIDATION.DOMAIN_UPDATE.LOGO.NOT_BLANK")
    private String logo;
}
