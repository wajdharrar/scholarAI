package com.research.paper.service.feedback;

import com.research.paper.dto.request.feedback.likes.LikeCreationRequest;
import com.research.paper.dto.response.feedback.LikeResponse;

import java.util.List;

public interface LikeService {
    void addLike(LikeCreationRequest request, String userId);
    void deleteLike(String LikeId);
    LikeResponse getLikeById(String LikeId);
    List<LikeResponse> getAllLikesByPaperId(String paperId);
    List<LikeResponse> getAllLikesByUserId(String userId);
}
