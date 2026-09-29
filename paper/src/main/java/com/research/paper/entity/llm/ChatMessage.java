package com.research.paper.entity.llm;

import com.research.paper.common.BaseEntity;
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
@Table(name = "CHAT_MESSAGE")
@EntityListeners(AuditingEntityListener.class)
public class ChatMessage extends BaseEntity {
    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;
    private int tokenCount;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false)
    private ChatSession session;
}
