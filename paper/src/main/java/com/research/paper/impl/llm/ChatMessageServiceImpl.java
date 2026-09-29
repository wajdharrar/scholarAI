package com.research.paper.impl.llm;

import com.research.paper.dto.mapper.llm.ChatMessageMapper;
import com.research.paper.dto.request.llm.chatMessage.ChatMessageCreation;
import com.research.paper.dto.request.llm.chatMessage.ChatMessageUpdate;
import com.research.paper.dto.response.llm.ChatMessageResponse;
import com.research.paper.enumeration.ErrorCode;
import com.research.paper.exception.BusinessException;
import com.research.paper.entity.llm.ChatMessage;
import com.research.paper.entity.llm.ChatSession;
import com.research.paper.repository.llm.ChatMessageRepository;
import com.research.paper.repository.llm.ChatSessionRepository;
import com.research.paper.service.llm.ChatMessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatMessageServiceImpl implements ChatMessageService {
    private final ChatMessageRepository chatMessageRepository;
    private final ChatSessionRepository chatSessionRepository;
    private final ChatMessageMapper chatMessageMapper;
    @Override
    public void addChatMessage(ChatMessageCreation request) {
        String sessionId = request.getSessionId();
        ChatSession chatSession = chatSessionRepository.findById(sessionId)
                .orElseThrow(()-> new BusinessException(ErrorCode.CHAT_SESSION_NOT_FOUND,sessionId));
        ChatMessage chatMessage = this.chatMessageMapper.toChatMessage(request);
        chatMessage.setSession(chatSession);
        int tokenCount = 0;
        String message = request.getContent();
        message = message.trim();
        for(int i=0 ; i < message.length() ; i++){
            if(message.charAt(i) ==  ' ' ){
                tokenCount++;
            }
        }
        chatMessage.setTokenCount(tokenCount+1);
        this.chatMessageRepository.save(chatMessage);
    }

    @Override
    public void updateChatMessage(ChatMessageUpdate request, String chatMessageId) {
        ChatMessage chatMessageSaved = chatMessageRepository.findById(chatMessageId)
                .orElseThrow(()->new BusinessException(ErrorCode.CHAT_MESSAGE_NOT_FOUND,chatMessageId));
        this.chatMessageMapper.mergeChatMessageInfo(chatMessageSaved,request);
        int tokenCount = 0;
        String message = request.getContent();
        message = message.trim();
        for(int i=0 ; i < message.length() ; i++){
            if(message.charAt(i) ==  ' ' ){
                tokenCount++;
            }
        }
        chatMessageSaved.setTokenCount(tokenCount+1);
        this.chatMessageRepository.save(chatMessageSaved);
    }

    @Override
    public void deleteChatMessage(String chatMessageId) {

    }

    @Override
    public List<ChatMessageResponse> getAllChatMessagesBySessionId(String sessionId) {
        return this.chatMessageRepository.findAllChatMessageBySessionId(sessionId)
                .stream()
                .map(chatMessageMapper :: toChatMessageResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ChatMessageResponse getChatMessageById(String chatMessageId) {
        return this.chatMessageMapper.toChatMessageResponse(this.chatMessageRepository.findById(chatMessageId)
                .orElseThrow(()->new BusinessException(ErrorCode.CHAT_MESSAGE_NOT_FOUND,chatMessageId)));
    }
}
