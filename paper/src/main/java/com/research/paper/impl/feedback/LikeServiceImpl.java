package com.research.paper.impl.feedback;

import com.research.paper.dto.mapper.feedback.LikeMapper;
import com.research.paper.dto.request.feedback.likes.LikeCreationRequest;
import com.research.paper.dto.response.feedback.LikeResponse;
import com.research.paper.enumeration.ErrorCode;
import com.research.paper.exception.BusinessException;
import com.research.paper.entity.feedback.Like;
import com.research.paper.entity.paper.ResearchPaper;
import com.research.paper.entity.user.User;
import com.research.paper.repository.User.UserRepository;
import com.research.paper.repository.feedback.LikeRepository;
import com.research.paper.repository.paper.ResearchPaperRepository;
import com.research.paper.service.feedback.LikeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
@Service
@RequiredArgsConstructor
public class LikeServiceImpl implements LikeService {
    private final LikeRepository likeRepository;
    private final ResearchPaperRepository researchPaperRepository;
    private final UserRepository userRepository;
    private final LikeMapper likeMapper;
    @Override
    public void addLike(LikeCreationRequest request, String userId) {
        Like like = new Like();
        User user = userRepository.findById(userId)
                .orElseThrow(()-> new BusinessException(ErrorCode.USER_NOT_FOUND,userId));
        ResearchPaper researchPaper = researchPaperRepository.findById(request.getResearchPaperId())
                .orElseThrow(()-> new BusinessException(ErrorCode.PAPER_NOT_FOUND,request.getResearchPaperId()));
        List<Like> likes = researchPaper.getLikes();
        researchPaper.setLikeCount(researchPaper.getLikeCount()+1);
        researchPaperRepository.save(researchPaper);
        like.setPaper(researchPaper);
        like.setUser(user);
        likes.add(like);
        likeRepository.save(like);
    }

    @Override
    public void deleteLike(String LikeId) {

    }

    @Override
    public LikeResponse getLikeById(String LikeId) {
        return likeMapper.toLikeResponse(likeRepository.findById(LikeId)
                .orElseThrow(()->new BusinessException(ErrorCode.LIKE_NOT_FOUND,LikeId)));
    }

    @Override
    public List<LikeResponse> getAllLikesByPaperId(String paperId) {
        return likeRepository.findByPaperId(paperId)
                .stream()
                .map(likeMapper :: toLikeResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<LikeResponse> getAllLikesByUserId(String userId) {
        return likeRepository.findByUserId(userId)
                .stream()
                .map(likeMapper ::toLikeResponse)
                .collect(Collectors.toList());
    }
}
