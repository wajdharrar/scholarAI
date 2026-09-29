package com.research.paper.repository.llm;

import com.research.paper.entity.llm.ChatMessage;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage,String> {
    @Query("select m from ChatMessage m where m.session.id = %?1")
    List<ChatMessage> findAllChatMessageBySessionId(String sessionId);
}
