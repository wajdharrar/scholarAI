package com.research.paper.entity;

import com.research.paper.common.BaseEntity;
import com.research.paper.enumeration.event.EventFormat;
import com.research.paper.enumeration.event.EventStatus;
import com.research.paper.enumeration.event.EventType;
import com.research.paper.entity.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@Table(name = "EVENT")
@EntityListeners(AuditingEntityListener.class)
public class Event extends BaseEntity {
    @Column(nullable = false)
    private String title;
    @Column(columnDefinition = "TEXT",nullable = false)
    private String description;
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private EventType eventType;
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private EventFormat eventFormat;
    private String location;
    private String virtualLink;
    @Column(nullable = false)
    private LocalDateTime startDateTime;
    private LocalDateTime endDateTime;
    private LocalDateTime registrationDeadline;
    private int maxAttendees;
    private int currentAttendees;
    private int speakerCount;
    private double price;
    private String currency ;
    private String imageUrl;
    @Enumerated(EnumType.STRING)
    private EventStatus status;
    @ManyToMany
    @JoinTable(
            name = "event_attendees",
            joinColumns = @JoinColumn(name = "event_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<User> attendees = new HashSet<>();
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organizer_id")
    private User organizer;
}
