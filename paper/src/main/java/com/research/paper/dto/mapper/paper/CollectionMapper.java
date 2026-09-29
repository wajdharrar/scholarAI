package com.research.paper.dto.mapper.paper;


import com.research.paper.dto.request.paper.collection.CollectionCreationRequest;
import com.research.paper.dto.request.paper.collection.CollectionUpdateRequest;
import com.research.paper.dto.response.paper.CollectionResponse;

import com.research.paper.enumeration.ErrorCode;
import com.research.paper.exception.BusinessException;
import com.research.paper.entity.paper.Collection;
import com.research.paper.entity.paper.SavedPaper;
import com.research.paper.repository.paper.SavedPaperRepository;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class CollectionMapper {
    private final SavedPaperRepository savedPaperRepository;
    public Collection toCollection(CollectionCreationRequest collectionCreationRequest){
        return Collection.builder()
                .name(collectionCreationRequest.getName())
                .description(collectionCreationRequest.getDescription())
                .aiEnabled(collectionCreationRequest.isAiEnabled())
                .build();
    }
    public void mergeCollectionInfo(Collection collection, CollectionUpdateRequest request) {
        if (StringUtils.isNotBlank(request.getName())
                && !collection.getName().equals(request.getName())) {
            collection.setName(request.getName());
        }
        if (StringUtils.isNotBlank(request.getDescription())
                && !collection.getDescription().equals(request.getDescription())) {
            collection.setDescription(request.getDescription());
        }
        if (request.isAiEnabled() != collection.isAiEnabled()){
            collection.setAiEnabled(request.isAiEnabled());
        }
        List<String> savedPaperIds = new ArrayList<>();
        collection.getPapers().forEach(savedPaper -> {savedPaperIds.add(savedPaper.getId());});
        if (!request.getSavedPapersId().isEmpty()
                && !request.getSavedPapersId().equals(savedPaperIds)) {
            List<SavedPaper> savedPapers = new ArrayList<>();
            request.getSavedPapersId().forEach( id ->{
                SavedPaper savedPaper = savedPaperRepository.findById(id)
                        .orElseThrow(()-> new BusinessException(ErrorCode.SAVED_PAPER_NOT_FOUND,id));
                savedPapers.add(savedPaper);
            });
            collection.setPapers(savedPapers);
        }
    }
    public CollectionResponse toCollectionResponse(Collection collection){
        CollectionResponse collectionResponse = CollectionResponse.builder()
                .name(collection.getName())
                .description(collection.getDescription())
                .aiEnabled(collection.isAiEnabled())
                .build();
        List<String> savedPaperTitles = new ArrayList<>();
        collection.getPapers().forEach(
                savedPaper -> {
                    savedPaperTitles.add(savedPaper.getPaper().getTitle());
                }
        );
        collectionResponse.setSavedPapersTitles(savedPaperTitles);
        return collectionResponse;
    }
}
