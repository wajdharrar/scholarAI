package com.research.paper.service.feedback;

import com.research.paper.dto.request.feedback.comment.CommentCreationRequest;
import com.research.paper.dto.request.feedback.comment.CommentUpdateRequest;
import com.research.paper.dto.response.feedback.CommentResponse;

import java.util.List;

public interface CommentService {
    void addComment(CommentCreationRequest commentCreationRequest , String userId);
    void updateComment(CommentUpdateRequest commentUpdateRequest , String commentId);
    void replyToComment(CommentCreationRequest commentCreationRequest , String userId);
    void signalComment(String commentId);
    CommentResponse likeComment(String commentId);
    void deleteComment(String commentId);
    List<CommentResponse> getAllComments();
    CommentResponse getCommentById(String commentId);
}
