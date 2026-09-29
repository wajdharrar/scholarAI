package com.research.paper.dto.response;

import com.research.paper.enumeration.event.EventFormat;
import com.research.paper.enumeration.event.EventStatus;
import com.research.paper.enumeration.event.EventType;
import lombok.*;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Component
public class EventResponse {
    private String id;
    private String title;
    private String description;
    private EventType eventType;
    private EventFormat eventFormat;
    private String location;
    private String virtualLink;
    private LocalDateTime startDateTime;
    private LocalDateTime endDateTime;
    private LocalDateTime registrationDeadline;
    private double price;
    private int speakerCount;
    private String currency;
    private String imageUrl;
    private String organizer;
    private EventStatus status;
    private Set<UserResponse> attendees = new HashSet<>();
}
