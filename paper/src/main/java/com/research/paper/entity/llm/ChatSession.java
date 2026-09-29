package com.research.paper.entity.llm;

import com.research.paper.common.BaseEntity;
import com.research.paper.enumeration.ChatContext;
import com.research.paper.entity.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@Table(name = "CHAT_SESSION")
@EntityListeners(AuditingEntityListener.class)
public class ChatSession extends BaseEntity {
    @Enumerated(EnumType.STRING)
    private ChatContext context;
    @Column(name = "SESSION_NAME")
    private String name;
    private boolean isPinned = false;
    @OneToMany(mappedBy = "session", cascade = CascadeType.ALL)
    private List<ChatMessage> messages = new ArrayList<>();
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "USER_ID", nullable = false)
    private User user;
}
