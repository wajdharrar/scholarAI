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
@Schema(description = "Request object for creating a new research event")
public class EventCreationRequest {

    @NotBlank(message = "VALIDATION.EVENT_CREATION.TITLE.NOT_BLANK")
    @Size(min = 10, max = 200, message = "VALIDATION.EVENT_CREATION.TITLE.SIZE")
    @Pattern(regexp = "^[a-zA-Z0-9\\s\\-:,;'\"]+$", message = "VALIDATION.EVENT_CREATION.TITLE.PATTERN")
    @Schema(example = "International Conference on Quantum Computing 2026")
    private String title;

    @NotBlank(message = "VALIDATION.EVENT_CREATION.DESCRIPTION.NOT_BLANK")
    @Size(min = 10, max = 3000, message = "VALIDATION.EVENT_CREATION.DESCRIPTION.SIZE")
    @Schema(example = "A gathering of global experts to discuss the future of quantum algorithmic efficiency.")
    private String description;

    @NotNull(message = "VALIDATION.EVENT_CREATION.EVENT_TYPE.NOT_NULL")
    @Schema(example = "CONFERENCE", description = "Type of the event")
    @Enumerated(EnumType.STRING)
    private EventType eventType;

    @NotNull(message = "VALIDATION.EVENT_CREATION.EVENT_FORMAT.NOT_NULL")
    @Schema(example = "HYBRID", description = "Format of the event (ONLINE, PHYSICAL, HYBRID)")
    @Enumerated(EnumType.STRING)
    private EventFormat eventFormat;

    @Size(max = 255)
    @Schema(example = "123 Science Way, Boston, MA", description = "Physical address, required if format is PHYSICAL or HYBRID")
    private String location;

    @Pattern(regexp = "^(https?://.*|)$", message = "VALIDATION.EVENT_CREATION.VIRTUAL_LINK.PATTERN")
    @Schema(example = "https://zoom.us/j/123456789", description = "URL for online access")
    private String virtualLink;

    @NotNull(message = "VALIDATION.EVENT_CREATION.START_DATE.NOT_NULL")
    @Future(message = "VALIDATION.EVENT_CREATION.START_DATE.FUTURE")
    @Schema(example = "2026-05-20T09:00:00")
    private LocalDateTime startDateTime;

    @NotNull(message = "VALIDATION.EVENT_CREATION.END_DATE.NOT_NULL")
    @Future(message = "VALIDATION.EVENT_CREATION.END_DATE.FUTURE")
    @Schema(example = "2026-05-22T17:00:00")
    private LocalDateTime endDateTime;

    @NotNull(message = "VALIDATION.EVENT_CREATION.REGISTRATION_DEADLINE.NOT_NULL")
    @Future(message = "VALIDATION.EVENT_CREATION.REGISTRATION_DEADLINE.FUTURE")
    @Schema(example = "2026-05-01T23:59:59")
    private LocalDateTime registrationDeadline;

    @PositiveOrZero(message = "VALIDATION.EVENT_CREATION.PRICE.POSITIVE")
    @Schema(example = "299.99")
    private double price;

    @NotBlank(message = "VALIDATION.EVENT_CREATION.CURRENCY.NOT_BLANK")
    @Size(min = 3, max = 3, message = "VALIDATION.EVENT_CREATION.CURRENCY.SIZE")
    @Schema(example = "USD", description = "ISO 4217 currency code")
    private String currency;

    @Schema(example = "https://my-bucket.s3.amazonaws.com/event-banner.jpg")
    private MultipartFile imageUrl;
    private Set<String> attendeesIds = new HashSet<>();
}