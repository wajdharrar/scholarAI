package com.research.paper.controller.feedback;

import com.research.paper.common.Utility;
import com.research.paper.dto.request.feedback.comment.CommentCreationRequest;
import com.research.paper.dto.request.feedback.comment.CommentUpdateRequest;
import com.research.paper.dto.response.feedback.CommentResponse;
import com.research.paper.impl.feedback.CommentServiceImpl;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/comment")
@RequiredArgsConstructor
@Tag(name = "Comment",description = "Comment API")
public class CommentController {
    private final CommentServiceImpl commentService;
    private final Utility utility;
    @PostMapping("/add")
    @ResponseStatus(code = HttpStatus.NO_CONTENT)
    public void addComment(
            @RequestBody
            @Valid
            CommentCreationRequest request,
            final Authentication principal){
        this.commentService.addComment(request,utility.getUserId(principal));
    }
    @PostMapping("/reply")
    @ResponseStatus(code = HttpStatus.NO_CONTENT)
    public void replyToComment(
            @RequestBody
            @Valid
            CommentCreationRequest request,
            final Authentication principal){
        this.commentService.replyToComment(request,utility.getUserId(principal));
    }
    @PatchMapping("/{comment_id}")
    @ResponseStatus(code = HttpStatus.NO_CONTENT)
    public void updateComment(
            @RequestBody
            @Valid
            CommentUpdateRequest request,
            @PathVariable(name = "comment_id")
            String commentId){
        this.commentService.updateComment(request,commentId);
    }
    @PatchMapping("/signal/{comment_id}")
    @ResponseStatus(code = HttpStatus.NO_CONTENT)
    public void signalComment(
            @PathVariable(name = "comment_id")
            String commentId){
        this.commentService.signalComment(commentId);
    }
    @PatchMapping("/like/{comment_id}")
    @ResponseStatus(code = HttpStatus.NO_CONTENT)
    public void likeComment(
            @PathVariable(name = "comment_id")
            String commentId){
        this.commentService.likeComment(commentId);
    }
    @GetMapping("/{comment_id}")
    public ResponseEntity<CommentResponse> getCommentById(
            @PathVariable(name = "comment_id")
            String commentId
    ){
        return ResponseEntity.ok(this.commentService.getCommentById(commentId));
    }
    @GetMapping("/")
    public ResponseEntity<List<CommentResponse>> getAllComments(){
        return ResponseEntity.ok(this.commentService.getAllComments());
    }
    @GetMapping("/paper/{id}")
    public ResponseEntity<List<CommentResponse>> getCommentsByPaper(@PathVariable("id") String id){
        return ResponseEntity.ok(this.commentService.getCommentsByPaper(id));
    }
}
