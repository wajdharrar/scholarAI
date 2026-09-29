package com.research.paper.dto.mapper.llm;

import com.research.paper.dto.request.llm.chatSession.ChatSessionCreationRequest;
import com.research.paper.dto.response.llm.ChatSessionResponse;

import com.research.paper.entity.llm.ChatSession;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class ChatSessionMapper {
    public ChatSession toChatSession(ChatSessionCreationRequest chatSessionCreationRequest){
        return ChatSession.builder()
                .name(chatSessionCreationRequest.getName())
                .isPinned(chatSessionCreationRequest.isPinned())
                .context(chatSessionCreationRequest.getContext())
                .messages(null)
                .build();
    }
    public ChatSessionResponse toChatSessionResponse(ChatSession chatSession){
        ChatSessionResponse chatSessionResponse = ChatSessionResponse.builder()
                .name(chatSession.getName())
                .isPinned(chatSession.isPinned())
                .context(chatSession.getContext())
                .firstName(chatSession.getUser().getFirstname())
                .lastName(chatSession.getUser().getLastname())
                .country(chatSession.getUser().getCountry())
                .institution(chatSession.getUser().getInstitution())
                .build();
        List<String> messageContent = new ArrayList<>();
        chatSession.getMessages().forEach(
                message->messageContent.add(message.getContent())
        );
        chatSessionResponse.setMessagesContent(messageContent);
        return chatSessionResponse;
    }
}
