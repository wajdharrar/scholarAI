package com.research.paper.dto.request.event;

import com.research.paper.enumeration.event.EventFormat;
import com.research.paper.enumeration.event.EventType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.*;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventUpdateRequest {

    @NotBlank(message = "VALIDATION.EVENT_CREATION.TITLE.NOT_BLANK")
    @Size(min = 10, max = 200, message = "VALIDATION.EVENT_CREATION.TITLE.SIZE")
    @Pattern(regexp = "^[a-zA-Z0-9\\s\\-:,;'\"]+$", message = "VALIDATION.EVENT_CREATION.TITLE.PATTERN")
    private String title;

    @NotBlank(message = "VALIDATION.EVENT_CREATION.DESCRIPTION.NOT_BLANK")
    @Size(min = 10, max = 3000, message = "VALIDATION.EVENT_CREATION.DESCRIPTION.SIZE")
    private String description;

    @NotNull(message = "VALIDATION.EVENT_CREATION.EVENT_TYPE.NOT_NULL")
    @Enumerated(EnumType.STRING)
    private EventType eventType;

    @NotNull(message = "VALIDATION.EVENT_CREATION.EVENT_FORMAT.NOT_NULL")
    @Enumerated(EnumType.STRING)
    private EventFormat eventFormat;

    @Size(max = 255)
    private String location;

    @Pattern(regexp = "^(https?://.*|)$", message = "VALIDATION.EVENT_CREATION.VIRTUAL_LINK.PATTERN")
    private String virtualLink;

    @NotNull(message = "VALIDATION.EVENT_CREATION.START_DATE.NOT_NULL")
    @Future(message = "VALIDATION.EVENT_CREATION.START_DATE.FUTURE")
    private LocalDateTime startDateTime;

    @NotNull(message = "VALIDATION.EVENT_CREATION.END_DATE.NOT_NULL")
    @Future(message = "VALIDATION.EVENT_CREATION.END_DATE.FUTURE")
    private LocalDateTime endDateTime;

    @NotNull(message = "VALIDATION.EVENT_CREATION.REGISTRATION_DEADLINE.NOT_NULL")
    @Future(message = "VALIDATION.EVENT_CREATION.REGISTRATION_DEADLINE.FUTURE")
    private LocalDateTime registrationDeadline;

    @PositiveOrZero(message = "VALIDATION.EVENT_CREATION.PRICE.POSITIVE")
    private double price;

    @NotBlank(message = "VALIDATION.EVENT_CREATION.CURRENCY.NOT_BLANK")
    @Size(min = 3, max = 3, message = "VALIDATION.EVENT_CREATION.CURRENCY.SIZE")
    private String currency;

    @PositiveOrZero(message = "VALIDATION.EVENT_CREATION.SPEAKER_COUNT.POSITIVE")
    private int speakerCount;

    // Changed to MultipartFile like creation request
    private MultipartFile imageUrl;

    private Set<String> attendeesIds = new HashSet<>();
}