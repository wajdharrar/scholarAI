package com.research.paper.dto.mapper.llm;



import com.research.paper.dto.request.llm.chatMessage.ChatMessageCreation;
import com.research.paper.dto.request.llm.chatMessage.ChatMessageUpdate;


import com.research.paper.dto.response.llm.ChatMessageResponse;
import com.research.paper.entity.llm.ChatMessage;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Component;




@Component
public class ChatMessageMapper {
    public ChatMessage toChatMessage(ChatMessageCreation chatMessageCreation){
        return ChatMessage.builder()
                .content(chatMessageCreation.getContent())
                .build();
    }
    public void mergeChatMessageInfo(ChatMessage chatMessage, ChatMessageUpdate request) {
        if (StringUtils.isNotBlank(request.getContent())
                && !chatMessage.getContent().equals(request.getContent())) {
            chatMessage.setContent(request.getContent());
        }
    }
    public ChatMessageResponse toChatMessageResponse(ChatMessage chatMessage){
        return ChatMessageResponse.builder()
                .content(chatMessage.getContent())
                .tokenCount(chatMessage.getTokenCount())
                .sessionName(chatMessage.getSession().getName())
                .build();
    }
}
