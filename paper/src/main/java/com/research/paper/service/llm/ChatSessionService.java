package com.research.paper.service.llm;

import com.research.paper.dto.request.llm.chatSession.ChatSessionCreationRequest;
import com.research.paper.dto.response.llm.ChatSessionResponse;

import java.util.List;

public interface ChatSessionService {
    void addChatSession(ChatSessionCreationRequest request , String userId);
    void deleteChatSession(String chatSessionId);
    List<ChatSessionResponse> getAllChatSessionByUserId(String userId);
    ChatSessionResponse getChatSessionById(String chatSessionId);
}
