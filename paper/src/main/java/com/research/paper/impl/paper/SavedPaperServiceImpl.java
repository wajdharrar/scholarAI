package com.research.paper.impl.paper;

import com.research.paper.dto.request.paper.savedPaper.AddPaperToCollectionRequest;
import com.research.paper.enumeration.ErrorCode;
import com.research.paper.exception.BusinessException;
import com.research.paper.entity.paper.Collection;
import com.research.paper.entity.paper.ResearchPaper;
import com.research.paper.entity.paper.SavedPaper;
import com.research.paper.entity.user.User;
import com.research.paper.repository.User.UserRepository;
import com.research.paper.repository.paper.CollectionRepository;
import com.research.paper.repository.paper.ResearchPaperRepository;
import com.research.paper.repository.paper.SavedPaperRepository;
import com.research.paper.service.paper.SavedPaperService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Service
@RequiredArgsConstructor
public class SavedPaperServiceImpl implements SavedPaperService {
    private final SavedPaperRepository savedPaperRepository;
    private final ResearchPaperRepository researchPaperRepository;
    private final UserRepository userRepository;
    private final CollectionRepository collectionRepository;
    @Override
    public void addPaperToCollection(AddPaperToCollectionRequest addPaperToCollectionRequest, String userId) {
        ResearchPaper researchPaper = researchPaperRepository.findById(addPaperToCollectionRequest.getPaperId())
                .orElseThrow(()-> new BusinessException(ErrorCode.PAPER_NOT_FOUND,addPaperToCollectionRequest.getPaperId()));
        Collection collection = collectionRepository.findById(addPaperToCollectionRequest.getCollectionId())
                .orElseThrow(()-> new BusinessException(ErrorCode.COLLECTION_NOT_FOUND,addPaperToCollectionRequest.getCollectionId()));
        User user = userRepository.findById(userId)
                .orElseThrow(()-> new BusinessException(ErrorCode.USER_NOT_FOUND,userId));
        SavedPaper savedPaper = new SavedPaper();
        savedPaper.setCollection(collection);
        savedPaper.setPaper(researchPaper);
        savedPaper.setUser(user);
        savedPaperRepository.save(savedPaper);
    }

    @Override
    public void removePaperFromCollection(AddPaperToCollectionRequest removePaperToCollectionRequest) {
        Collection collection = collectionRepository.findById(removePaperToCollectionRequest.getCollectionId())
                .orElseThrow(()-> new BusinessException(ErrorCode.COLLECTION_NOT_FOUND,removePaperToCollectionRequest.getCollectionId()));
        collection.getPapers().forEach(savedPaper -> {
            if (Objects.equals(savedPaper.getPaper().getId(), removePaperToCollectionRequest.getPaperId())){
                collection.getPapers().remove(savedPaper);
            }
        });
    }
}
