package com.research.paper.dto.mapper.feedback;

import com.research.paper.dto.mapper.UserMapper;
import com.research.paper.dto.mapper.paper.ResearchPaperMapper;
import com.research.paper.dto.request.feedback.comment.CommentCreationRequest;
import com.research.paper.dto.request.feedback.comment.CommentUpdateRequest;
import com.research.paper.dto.response.feedback.CommentResponse;
import com.research.paper.enumeration.ErrorCode;
import com.research.paper.exception.BusinessException;
import com.research.paper.entity.feedback.Comment;
import com.research.paper.repository.feedback.CommentRepository;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CommentMapper {
    private final CommentRepository commentRepository;
    private final ResearchPaperMapper researchPaperMapper;
    private final UserMapper userMapper;
    public Comment toComment(CommentCreationRequest request, boolean save){
        Comment comment = Comment.builder()
                .content(request.getContent())
                .likes(0)
                .build();
        if(save){
            comment.setParentComment(null);
        }else{
            comment.setParentComment(commentRepository.findById(request.getParentCommentId())
                    .orElseThrow(()->new BusinessException(ErrorCode.PARENT_COMMENT_NOT_FOUND,request.getParentCommentId())));
        }
        return comment;
    }
    public void mergeCommentInfo(Comment comment, CommentUpdateRequest request) {
        if (StringUtils.isNotBlank(request.getContent())
                && !comment.getContent().equals(request.getContent())) {
            comment.setContent(request.getContent());
        }
    }
    public CommentResponse toCommentResponse(Comment comment){
        CommentResponse commentResponse = CommentResponse.builder()
                .content(comment.getContent())
                .likes(comment.getLikes())
                .researchPaperTitle(comment.getPaper().getTitle())
                .firstName(comment.getUser().getFirstname())
                .lastName(comment.getUser().getLastname())
                .country(comment.getUser().getCountry())
                .institution(comment.getUser().getInstitution())
                .build();
        if(comment.getParentComment() != null){
            commentResponse.setParentContent(comment.getParentComment().getContent());
            commentResponse.setParentId(comment.getParentComment().getId());
        }
        return commentResponse;
    }
}
