package com.research.paper.impl.llm;

import com.research.paper.dto.mapper.llm.ChatSessionMapper;
import com.research.paper.dto.request.llm.chatSession.ChatSessionCreationRequest;
import com.research.paper.dto.response.llm.ChatSessionResponse;
import com.research.paper.enumeration.ErrorCode;
import com.research.paper.exception.BusinessException;
import com.research.paper.entity.llm.ChatSession;
import com.research.paper.entity.user.User;
import com.research.paper.repository.User.UserRepository;
import com.research.paper.repository.llm.ChatSessionRepository;
import com.research.paper.service.llm.ChatSessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatSessionServiceImpl implements ChatSessionService {
    private final UserRepository userRepository;
    private final ChatSessionMapper chatSessionMapper;
    private final ChatSessionRepository chatSessionRepository;
    @Override
    public void addChatSession(ChatSessionCreationRequest request, String userId) {
        User user = this.userRepository.findById(userId)
                .orElseThrow(()->new BusinessException(ErrorCode.USER_NOT_FOUND,userId));
        ChatSession chatSession = chatSessionMapper.toChatSession(request);
        chatSession.setUser(user);
        chatSessionRepository.save(chatSession);
    }

    @Override
    public void deleteChatSession(String chatSessionId) {

    }

    @Override
    public List<ChatSessionResponse> getAllChatSessionByUserId(String userId) {
        return this.chatSessionRepository.findAllChatSessionByUserId(userId)
                .stream()
                .map(chatSessionMapper :: toChatSessionResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ChatSessionResponse getChatSessionById(String chatSessionId) {
        return this.chatSessionMapper.toChatSessionResponse(
                this.chatSessionRepository.findById(chatSessionId)
                .orElseThrow(()-> new BusinessException(ErrorCode.CHAT_SESSION_NOT_FOUND,chatSessionId)));
    }
}
