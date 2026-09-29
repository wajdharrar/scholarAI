package com.research.paper.entity;

import com.research.paper.common.BaseEntity;
import com.research.paper.enumeration.NotificationType;
import com.research.paper.entity.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@Table(name = "NOTIFICATION")
@EntityListeners(AuditingEntityListener.class)
public class Notification extends BaseEntity {
    private String title;
    private String message;
    @Enumerated(EnumType.STRING)
    private NotificationType type;
    private String referenceId;
    private String referenceType;
    private boolean isRead = false;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
