package com.research.paper.repository.llm;

import com.research.paper.entity.llm.ChatSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ChatSessionRepository extends JpaRepository<ChatSession,String> {
    @Query("select s from ChatSession s where s.user.id = %?1")
    List<ChatSession> findAllChatSessionByUserId(String userId);
}
