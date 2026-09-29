package com.research.paper.controller.llm;


import com.research.paper.dto.request.llm.chatMessage.ChatMessageCreation;
import com.research.paper.dto.request.llm.chatMessage.ChatMessageUpdate;


import com.research.paper.dto.response.llm.ChatMessageResponse;

import com.research.paper.impl.llm.ChatMessageServiceImpl;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/chat_message")
@Tag(name = "Chat message",description = "Chat message API")
public class ChatMessageController {
    private final ChatMessageServiceImpl chatMessageService;
    @PostMapping("/add")
    @ResponseStatus(code = HttpStatus.NO_CONTENT)
    public void addChatMessage(
            @RequestBody
            @Valid
            ChatMessageCreation request){
        this.chatMessageService.addChatMessage(request);
    }
    @PatchMapping("{chat_message_id}")
    @ResponseStatus(code = HttpStatus.NO_CONTENT)
    public void updateChatMessage(
            @RequestBody
            @Valid
            ChatMessageUpdate request,
            @PathVariable(name = "chat_message_id")
            String chatMessageId){
        this.chatMessageService.updateChatMessage(request,chatMessageId);
    }
    @GetMapping("/session/{session_id}")
    public ResponseEntity<List<ChatMessageResponse>> getAllCollectionsByUserId(
            @PathVariable(name = "session_id")
            String sessionId
    ){
        return ResponseEntity.ok(this.chatMessageService.getAllChatMessagesBySessionId(sessionId));
    }
    @GetMapping("/{chat_message_id}")
    public ResponseEntity<ChatMessageResponse> getCollectionById(
            @PathVariable(name = "chat_message_id")
            String chatMessageId
    ){
        return ResponseEntity.ok(this.chatMessageService.getChatMessageById(chatMessageId));
    }
}
