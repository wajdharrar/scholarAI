package com.research.paper.service.llm;

import com.research.paper.dto.request.llm.chatMessage.ChatMessageCreation;
import com.research.paper.dto.request.llm.chatMessage.ChatMessageUpdate;
import com.research.paper.dto.response.llm.ChatMessageResponse;


import java.util.List;

public interface ChatMessageService {
    void addChatMessage(ChatMessageCreation request);
    void updateChatMessage(ChatMessageUpdate request, String chatMessageId);
    void deleteChatMessage(String chatMessageId);
    List<ChatMessageResponse> getAllChatMessagesBySessionId(String sessionId);
    ChatMessageResponse getChatMessageById(String chatMessageId);
}
