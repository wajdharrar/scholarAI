package com.research.paper.dto.mapper.paper;

import com.research.paper.dto.request.paper.researchPaper.PaperUpdateRequest;
import com.research.paper.dto.response.paper.ResearchPaperResponse;
import com.research.paper.enumeration.ErrorCode;
import com.research.paper.exception.BusinessException;
import com.research.paper.entity.paper.ResearchPaper;
import com.research.paper.entity.user.User;
import com.research.paper.repository.User.UserRepository;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;

@Component
@RequiredArgsConstructor
public class ResearchPaperMapper {
    private final UserRepository userRepository;
    public void mergePaperInfo(ResearchPaper paper, PaperUpdateRequest request) {
        if (StringUtils.isNotBlank(request.getTitle())
                && !paper.getTitle().equals(request.getTitle())) {
            paper.setTitle(request.getTitle());
        }
        if (StringUtils.isNotBlank(request.getAbstractText())
                && !paper.getAbstractText().equals(request.getAbstractText())) {
            paper.setAbstractText(request.getAbstractText());
        }

        if (Objects.nonNull(request.getCategory())
                && !paper.getCategory().equals(request.getCategory())) {
            paper.setCategory(request.getCategory());
        }
        if(Objects.nonNull(request.getPublicationDate())){
            paper.setPublicationDate(request.getPublicationDate());
        }

        if(!request.getAuthorIds().isEmpty()){
            request.getAuthorIds().forEach(
                    id -> {
                        final Optional<User> author=userRepository.findById(id);
                        if(author.isPresent()){
                            paper.getAuthors().add(author.get());
                        }else{
                            throw new BusinessException(ErrorCode.AUTHORS_NOT_FOUND);
                        }
                    }
                    );
        }
    }
    public ResearchPaperResponse toResearchPaperResponse(ResearchPaper researchPaper){
        ResearchPaperResponse researchPaperResponse = ResearchPaperResponse.builder()
                                                                            .id(researchPaper.getId())
                                                                            .title(researchPaper.getTitle())
                                                                            .abstractText(researchPaper.getAbstractText())
                                                                            .category(researchPaper.getCategory())
                                                                            .keywords(researchPaper.getKeywords())
                                                                            .document(researchPaper.getDocument())
                                                                            .commentCount(researchPaper.getCommentCount())
                                                                            .likesCount(researchPaper.getLikeCount())
                                                                            .downloadsCount(researchPaper.getDownloadCount())
                                                                            .thumbnailUrl(researchPaper.getThumbnail())
                                                                            .citations(researchPaper.getCitationCount())
                                                                            .status(researchPaper.getStatus())
                                                                            .publicationDate(researchPaper.getPublicationDate())
                                                                            .build();
        Set<String> authors = new HashSet<>();
        researchPaper.getAuthors().forEach(
                author -> authors.add(author.getFirstname())
        );
        authors.addAll(researchPaper.getGuestAuthors());
        researchPaperResponse.setAuthorIds(authors);
        return researchPaperResponse;
    }
}
