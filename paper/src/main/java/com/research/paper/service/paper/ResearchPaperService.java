package com.research.paper.service.paper;

import com.research.paper.dto.request.paper.researchPaper.PaperCreationRequest;
import com.research.paper.dto.request.paper.researchPaper.PaperUpdateRequest;
import com.research.paper.dto.response.paper.ResearchPaperResponse;

import java.io.IOException;
import java.util.List;

public interface ResearchPaperService {
    void addResearchPaper(PaperCreationRequest paperCreationRequest , String userId);
    void updateResearchPaper(PaperUpdateRequest paperUpdateRequest , String paperId);
    void validateResearchPaper(String paperId);
    void rejectResearchPaper(String paperId);
    void deleteResearchPaper(String paperId);
    List<ResearchPaperResponse> getAllResearchPaper(String id) throws Exception;
    ResearchPaperResponse getResearchPaperById(String paperId);
    public List<ResearchPaperResponse> getResearchPaperByUserId(String userId);
}
