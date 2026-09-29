package com.research.paper.dto.mapper.feedback;

import com.research.paper.dto.response.feedback.LikeResponse;
import com.research.paper.entity.feedback.Like;
import org.springframework.stereotype.Component;

@Component
public class LikeMapper {
    public LikeResponse toLikeResponse(Like like){
        return LikeResponse.builder()
                .researchPaperTitle(like.getPaper().getTitle())
                .lastName(like.getUser().getLastname())
                .firstName(like.getUser().getFirstname())
                .country(like.getUser().getCountry())
                .institution(like.getUser().getInstitution())
                .build();
    }
}
